import { useEffect } from 'react'

/**
 * Web-only callback page for Apple Sign In.
 * Apple redirects the popup here with ?code=xxx&state=yyy (response_mode=query).
 * This component extracts the params, posts them to the opener window, and closes the popup.
 */
export const AppleSSOCallback = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code') ?? ''
    const state = params.get('state') ?? ''
    const error = params.get('error') ?? ''

    if (window.opener) {
      window.opener.postMessage(
        { type: 'apple-sso-callback', code, state, error },
        window.location.origin
      )
    }
    window.close()
  }, [])

  return null
}
