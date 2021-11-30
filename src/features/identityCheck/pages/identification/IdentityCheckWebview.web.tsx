import { useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'

import { REDIRECT_URL_UBBLE } from 'features/identityCheck/api'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { UseRouteType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { Helmet } from 'libs/react-helmet/Helmet'

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
export const IdentityCheckWebview: React.FC = () => {
  const { params } = useRoute<UseRouteType<'IdentityCheckWebview'>>()
  const { navigateToNextScreen } = useIdentityCheckNavigation()

  useEffect(() => {
    window.onUbbleReady = () => {
      const ubbleIDV = new Ubble.IDV(document.getElementById(ubbleIframeId), {
        width: '100%',
        height: '100%',
        allowCamera: true,
        identificationUrl: params.identificationUrl,
        events: {
          onComplete({ redirectUrl, status }: CompleteEvent) {
            analytics.logIdentityCheckComplete({ status })
            ubbleIDV.destroy()
            if (redirectUrl.includes(REDIRECT_URL_UBBLE)) navigateToNextScreen()
          },
          onAbort({ redirectUrl, status, returnReason }: AbortEvent) {
            analytics.logIdentityCheckAbort({ status, returnReason })
            ubbleIDV.destroy()
            // TODO(antoinewg): navigate to an error page.
            if (redirectUrl.includes(REDIRECT_URL_UBBLE)) navigateToNextScreen()
          },
        },
      })
    }
  }, [])

  return (
    <React.Fragment>
      <Helmet>
        <script
          src="https://oos.eu-west-2.outscale.com/public-ubble-ai/iframe-sdk-0.0.1.js"
          type="application/javascript"
        />
      </Helmet>
      <div id={ubbleIframeId} style={style} />
    </React.Fragment>
  )
}

const style = { flex: 1 }
