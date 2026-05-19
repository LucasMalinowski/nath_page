import { SeverityNumber } from '@opentelemetry/api-logs'
import { loggerProvider } from '@/instrumentation'

type LogSeverity = 'debug' | 'info' | 'warn' | 'error'
type LogAttributeValue = string | number | boolean

type EmitPostHogLogOptions = {
  body: string
  severity?: LogSeverity
  attributes?: Record<string, unknown>
}

const logger = loggerProvider.getLogger('nathalia-portfolio')

const severityNumberByName: Record<LogSeverity, SeverityNumber> = {
  debug: SeverityNumber.DEBUG,
  info: SeverityNumber.INFO,
  warn: SeverityNumber.WARN,
  error: SeverityNumber.ERROR
}

function sanitizeLogAttributes(attributes: Record<string, unknown> = {}) {
  const sanitized: Record<string, LogAttributeValue> = {}

  for (const [key, value] of Object.entries(attributes)) {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key] = value
      continue
    }

    if (value === null || value === undefined) continue

    try {
      sanitized[key] = JSON.stringify(value)
    } catch {
      sanitized[key] = String(value)
    }
  }

  return sanitized
}

export async function emitPostHogLog({
  body,
  severity = 'info',
  attributes = {}
}: EmitPostHogLogOptions) {
  if (process.env.NEXT_RUNTIME === 'edge') return

  logger.emit({
    body,
    severityNumber: severityNumberByName[severity],
    severityText: severity.toUpperCase(),
    attributes: sanitizeLogAttributes({
      ...attributes,
      source: 'next_server'
    })
  })

  try {
    await loggerProvider.forceFlush()
  } catch (error) {
    console.warn('[posthog] failed to flush log', error)
  }
}
