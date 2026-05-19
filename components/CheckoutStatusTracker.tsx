'use client'

import { useEffect } from 'react'
import { captureBrowserEvent } from '@/lib/posthog-browser'

export default function CheckoutStatusTracker({ status }: { status: 'success' | 'pending' | 'failure' }) {
  useEffect(() => {
    captureBrowserEvent('checkout_returned', { status })
  }, [status])

  return null
}
