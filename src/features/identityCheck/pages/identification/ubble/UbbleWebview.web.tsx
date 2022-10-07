import React, { useEffect } from 'react'

import { IdentityCheckMethod } from 'api/gen'
import { REDIRECT_URL_UBBLE, useIdentificationUrl } from 'features/identityCheck/api/api'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { navigateToHome } from 'features/navigation/helpers'
import { analytics } from 'libs/firebase/analytics'
import { Helmet } from 'libs/react-helmet/Helmet'
import { LoadingPage } from 'ui/components/LoadingPage'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Ubble: any

const ubbleIframeId = 'ubble-container'

interface CompleteEvent {
  status: 'processing'
  redirectUrl: string
}
interface AbortEvent {
  status: 'aborted'
  returnReason: string
  redirectUrl: string
}

// https://ubbleai.github.io/developer-documentation/#webview-integration
export const UbbleWebview: React.FC = () => {
  const identificationUrl = useIdentificationUrl()
  const { navigateToNextScreen } = useIdentityCheckNavigation()

  useEffect(() => {
    if (!identificationUrl) return
    window.onUbbleReady = () => {
      const ubbleIDV = new Ubble.IDV(document.getElementById(ubbleIframeId), {
        width: '100%',
        height: '100%',
        allowCamera: true,
        identificationUrl,
        events: {
          onComplete({ redirectUrl }: CompleteEvent) {
            analytics.logIdentityCheckSuccess({ method: IdentityCheckMethod.ubble })
            ubbleIDV.destroy()
            if (redirectUrl.includes(REDIRECT_URL_UBBLE)) navigateToNextScreen()
          },
          onAbort({ redirectUrl, returnReason: reason }: AbortEvent) {
            analytics.logIdentityCheckAbort({
              method: IdentityCheckMethod.ubble,
              reason,
              errorType: new URL(redirectUrl).searchParams.get('error_type') || null,
            })
            ubbleIDV.destroy()
            navigateToHome()
          },
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identificationUrl])

  if (!identificationUrl) {
    return <LoadingPage />
  }

  return (
    <React.Fragment>
      <Helmet>
        <script src="https://oos.eu-west-2.outscale.com/public-ubble-ai/iframe-sdk-0.0.1.js" />
      </Helmet>
      <div id={ubbleIframeId} style={style} />
    </React.Fragment>
  )
}

const style = { flex: 1 }
