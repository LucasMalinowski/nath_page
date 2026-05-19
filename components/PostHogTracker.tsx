'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { captureBrowserEvent, identifyBrowserUser, resetBrowserAnalytics } from '@/lib/posthog-browser'

const postHogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
const postHogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

function postHogInitScript() {
  if (!postHogKey) return ''
  const key = JSON.stringify(postHogKey)
  const host = JSON.stringify(postHogHost)

  return `
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once unregister identify alias set_config reset people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user captureException".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    posthog.init(${key}, {
      api_host: ${host},
      capture_pageview: false,
      autocapture: true,
      person_profiles: "identified_only"
    });
    window.dispatchEvent(new Event("posthog-ready"));
  `
}

export default function PostHogTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`
    captureBrowserEvent('$pageview', {
      $current_url: window.location.href,
      path: url
    })
  }, [pathname, searchParams])

  useEffect(() => {
    let mounted = true

    const syncUser = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()

      if (!mounted) return

      if (session?.user) {
        identifyBrowserUser(session.user.id, {
          email: session.user.email,
          full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || null
        })
      }
    }

    void syncUser()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        identifyBrowserUser(session.user.id, {
          email: session.user.email,
          full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || null
        })
        captureBrowserEvent(`auth_${event.toLowerCase()}`, { user_id: session.user.id })
      } else if (event === 'SIGNED_OUT') {
        captureBrowserEvent('auth_signed_out')
        resetBrowserAnalytics()
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  if (!postHogKey) return null

  return <Script id="posthog-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: postHogInitScript() }} />
}
