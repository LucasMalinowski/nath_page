'use client'

type PostHogWindow = Window & {
  posthog?: {
    capture: (event: string, properties?: Record<string, unknown>) => void
    identify: (distinctId: string, properties?: Record<string, unknown>) => void
    reset: () => void
  }
  __posthogQueue?: PostHogQueuedCall[]
}

type PostHogQueuedCall =
  | { type: 'capture'; event: string; properties: Record<string, unknown> }
  | { type: 'identify'; distinctId: string; properties: Record<string, unknown> }
  | { type: 'reset' }

const MAX_QUEUE_SIZE = 100

function getPostHogWindow() {
  if (typeof window === 'undefined') return null
  return window as PostHogWindow
}

function flushPostHogQueue(postHogWindow: PostHogWindow) {
  const posthog = postHogWindow.posthog
  const queue = postHogWindow.__posthogQueue
  if (!posthog || !queue?.length) return

  postHogWindow.__posthogQueue = []
  for (const call of queue) {
    if (call.type === 'capture') posthog.capture(call.event, call.properties)
    if (call.type === 'identify') posthog.identify(call.distinctId, call.properties)
    if (call.type === 'reset') posthog.reset()
  }
}

function enqueuePostHogCall(call: PostHogQueuedCall) {
  const postHogWindow = getPostHogWindow()
  if (!postHogWindow) return

  postHogWindow.__posthogQueue = postHogWindow.__posthogQueue || []
  postHogWindow.__posthogQueue.push(call)
  if (postHogWindow.__posthogQueue.length > MAX_QUEUE_SIZE) {
    postHogWindow.__posthogQueue.shift()
  }

  window.addEventListener('posthog-ready', () => flushPostHogQueue(postHogWindow), { once: true })
}

export function captureBrowserEvent(event: string, properties: Record<string, unknown> = {}) {
  const postHogWindow = getPostHogWindow()
  if (!postHogWindow) return

  if (postHogWindow.posthog) {
    flushPostHogQueue(postHogWindow)
    postHogWindow.posthog.capture(event, properties)
    return
  }

  enqueuePostHogCall({ type: 'capture', event, properties })
}

export function identifyBrowserUser(distinctId: string, properties: Record<string, unknown> = {}) {
  const postHogWindow = getPostHogWindow()
  if (!postHogWindow) return

  if (postHogWindow.posthog) {
    flushPostHogQueue(postHogWindow)
    postHogWindow.posthog.identify(distinctId, properties)
    return
  }

  enqueuePostHogCall({ type: 'identify', distinctId, properties })
}

export function resetBrowserAnalytics() {
  const postHogWindow = getPostHogWindow()
  if (!postHogWindow) return

  if (postHogWindow.posthog) {
    flushPostHogQueue(postHogWindow)
    postHogWindow.posthog.reset()
    return
  }

  enqueuePostHogCall({ type: 'reset' })
}
