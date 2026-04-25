import type { User } from '@supabase/supabase-js'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function resolveRequestUser(request: Request): Promise<User> {
  const supabase = createServerSupabaseClient()
  const supabaseAdmin = getSupabaseAdmin()
  const cookieUserResponse = await supabase.auth.getUser()
  let user = cookieUserResponse.data.user

  if (!user) {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null

    if (token) {
      const bearerUserResponse = await supabaseAdmin.auth.getUser(token)
      user = bearerUserResponse.data.user
    }
  }

  if (!user) {
    throw new Error('Authentication required')
  }

  return user
}

export async function requireAdmin(request: Request) {
  const supabaseAdmin = getSupabaseAdmin()
  const user = await resolveRequestUser(request)
  const { data: profile, error } = await supabaseAdmin.from('users').select('admin').eq('id', user.id).maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (!profile?.admin) {
    throw new Error('Admin access required')
  }

  return { user, supabaseAdmin }
}
