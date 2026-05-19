import { emitPostHogLog } from '@/lib/posthog-logs'

type PostHogProperties = Record<string, unknown>

const DEFAULT_POSTHOG_HOST = 'https://us.i.posthog.com'

function getPostHogConfig() {
  const apiKey = process.env.POSTHOG_PROJECT_API_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY
  const host = (process.env.POSTHOG_HOST || process.env.NEXT_PUBLIC_POSTHOG_HOST || DEFAULT_POSTHOG_HOST).replace(/\/$/, '')

  if (!apiKey) return null
  return { apiKey, host }
}

export async function captureServerEvent(
  event: string,
  distinctId: string,
  properties: PostHogProperties = {}
) {
  const config = getPostHogConfig()
  if (!config) return

  try {
    const response = await fetch(`${config.host}/capture/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: config.apiKey,
        event,
        distinct_id: distinctId,
        properties: {
          ...properties,
          source: 'next_server'
        }
      })
    })

    await emitPostHogLog({
      body: `PostHog server event captured: ${event}`,
      severity: response.ok ? 'info' : 'warn',
      attributes: {
        posthog_event: event,
        posthog_status: response.status,
        distinct_id: distinctId,
        capture_ok: response.ok
      }
    })
  } catch (error) {
    await emitPostHogLog({
      body: `PostHog server event failed: ${event}`,
      severity: 'error',
      attributes: {
        posthog_event: event,
        distinct_id: distinctId,
        error_message: error instanceof Error ? error.message : String(error)
      }
    })
    console.warn('[posthog] failed to capture server event', event, error)
  }
}

export async function captureServerException(
  event: string,
  distinctId: string,
  error: unknown,
  properties: PostHogProperties = {}
) {
  await emitPostHogLog({
    body: `Server exception captured: ${event}`,
    severity: 'error',
    attributes: {
      posthog_event: event,
      distinct_id: distinctId,
      error_name: error instanceof Error ? error.name : 'UnknownError',
      error_message: error instanceof Error ? error.message : String(error)
    }
  })

  await captureServerEvent(event, distinctId, {
    ...properties,
    error_message: error instanceof Error ? error.message : String(error)
  })
}
