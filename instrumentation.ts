import { logs } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

const DEFAULT_POSTHOG_HOST = 'https://us.i.posthog.com'
const postHogToken = process.env.POSTHOG_PROJECT_API_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY
const postHogLogsHost = (
  process.env.POSTHOG_LOGS_HOST ||
  process.env.POSTHOG_HOST ||
  process.env.NEXT_PUBLIC_POSTHOG_HOST ||
  DEFAULT_POSTHOG_HOST
).replace(/\/$/, '')

const processors = postHogToken
  ? [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: `${postHogLogsHost}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${postHogToken}`,
            'Content-Type': 'application/json'
          }
        })
      )
    ]
  : []

export const loggerProvider = new LoggerProvider({
  resource: resourceFromAttributes({
    'service.name': 'nathalia-portfolio',
    'deployment.environment': process.env.VERCEL_ENV || process.env.NODE_ENV || 'development'
  }),
  processors
})

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    logs.setGlobalLoggerProvider(loggerProvider)
  }
}
