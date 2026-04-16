import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendSuperFreteLowBalanceEmail } from '@/lib/mailer'
import { getSuperFreteBalance, isSuperFreteConfigured } from '@/lib/superfrete'

export const runtime = 'nodejs'

const DEFAULT_THRESHOLD = 30
const ALERT_KEY = 'superfrete_balance_alert'

function getSupabaseServiceClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase server credentials')
  }

  return createClient(supabaseUrl, serviceRoleKey)
}

function isOlderThan24Hours(timestamp: string | null | undefined) {
  if (!timestamp) return true
  const time = new Date(timestamp).getTime()
  if (!Number.isFinite(time)) return true
  return Date.now() - time >= 24 * 60 * 60 * 1000
}

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  // Always require the secret — if it is not configured, deny the request
  // rather than allowing unauthenticated callers to trigger balance checks.
  if (!cronSecret) {
    console.error('[balance-alert] CRON_SECRET env var is not set')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSuperFreteConfigured()) {
    return NextResponse.json({ ok: false, skipped: 'SuperFrete not configured' }, { status: 200 })
  }

  const threshold = Number(process.env.SUPERFRETE_LOW_BALANCE_THRESHOLD || DEFAULT_THRESHOLD)
  const recipient = process.env.SUPERFRETE_LOW_BALANCE_EMAIL || 'malinowskinathalia@gmail.com'
  const supabase = getSupabaseServiceClient()

  const balance = await getSuperFreteBalance()
  const { data: alertRow, error: alertError } = await supabase
    .from('keepalive')
    .select('last_ping')
    .eq('id', ALERT_KEY)
    .maybeSingle()

  if (alertError) {
    return NextResponse.json({ error: alertError.message }, { status: 500 })
  }

  const shouldAlert = balance < threshold && isOlderThan24Hours(alertRow?.last_ping)

  if (shouldAlert) {
    await sendSuperFreteLowBalanceEmail({
      to: recipient,
      balance,
      threshold
    })

    const { error: updateError } = await supabase
      .from('keepalive')
      .upsert({ id: ALERT_KEY, last_ping: new Date().toISOString() }, { onConflict: 'id' })

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }
  }

  return NextResponse.json({
    ok: true,
    balance,
    threshold,
    emailed: shouldAlert
  })
}
