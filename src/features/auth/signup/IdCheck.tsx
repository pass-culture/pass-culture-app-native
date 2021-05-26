import { initialRouteName as idCheckInitialRouteName } from '@pass-culture/id-check'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useEffect, useRef, useState } from 'react'
import { WebView, WebViewNavigation } from 'react-native-webview'
import styled from 'styled-components/native'

import { useAppSettings } from 'features/auth/settings'
import { navigateToHome, openExternalUrl, useCurrentRoute } from 'features/navigation/helpers'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { storage } from 'libs/storage'
import { LoadingPage } from 'ui/components/LoadingPage'

import { useKeyboardAdjustFixIdCheck } from '../hooks/useKeyboardAdjustFixIdCheck'

type Props = StackScreenProps<RootStackParamList, 'IdCheck'>

export const IdCheck: React.FC<Props> = function (props) {
  const { data: settings, isLoading: areSettingsLoading } = useAppSettings()
  const currentRoute = useCurrentRoute()
  const navigation = useNavigation<UseNavigationType>()
  const webviewRef = useRef<WebView>(null)
  const injectedJavascript = useKeyboardAdjustFixIdCheck()

  const [idCheckUri, setIdCheckUri] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!areSettingsLoading && settings?.enableNativeIdCheckVersion) {
      const { email, licenceToken } = props.route.params
      navigation.navigate(idCheckInitialRouteName, { email, licence_token: licenceToken })
    }
  }, [settings?.enableNativeIdCheckVersion, areSettingsLoading])

  useEffect(() => {
    const { email, licenceToken } = props.route.params
    const encodedEmail = encodeURIComponent(email)
    storage.readObject<boolean>('has_accepted_cookie').then((hasAcceptedCookies) => {
      let userConsentDataCollection = false
      if (hasAcceptedCookies) {
        userConsentDataCollection = true
      }
      const uri = `${env.ID_CHECK_URL}/?email=${encodedEmail}&user_consent_data_collection=${userConsentDataCollection}&licence_token=${licenceToken}`
      setIdCheckUri(uri)
    })
  }, [])

  function onNavigationStateChange(event: WebViewNavigation) {
    // For more info, see the buffer pages (i.e. to exit the webview) of the Id Check web app
    const isEligibilityProcessAbandonned = event.url.includes('/exit')
    const isEligibilityProcessFinished = event.url.includes('/end')
    const isRedirectedToDMS = event.url.includes('demarches-simplifiees')
    if (isEligibilityProcessAbandonned) {
      navigateToHome()
    } else if (isEligibilityProcessFinished) {
      navigation.navigate('BeneficiaryRequestSent')
    } else if (!settings?.displayDmsRedirection) {
      // this is double check as button is not shown on idCheck component
      return
    } else if (isRedirectedToDMS) {
      openExternalUrl(event.url)
      // we need to force the webview to go back otherwise it opens DMS url
      webviewRef.current?.goBack()
    }
  }

  if (areSettingsLoading || !idCheckUri || currentRoute?.name !== 'IdCheck') {
    return null
  }
  return (
    <StyledWebview
      injectedJavaScript={injectedJavascript}
      ref={webviewRef}
      testID="idcheck-webview"
      source={{ uri: idCheckUri }}
      startInLoadingState={true}
      renderLoading={() => (
        <LoadingPageContainer>
          <LoadingPage />
        </LoadingPageContainer>
      )}
      onNavigationStateChange={onNavigationStateChange}
      onError={({ nativeEvent }) => {
        if (nativeEvent.url.startsWith('mailto:') && nativeEvent.canGoBack) {
          // Fallback for mailto links when ERR_UNKNOWN_URL_SCHEME error appears
          webviewRef.current?.goBack()
        }
      }}
    />
  )
}

const StyledWebview = styled(WebView)({
  height: '100%',
  width: '100%',
  opacity: 0.99, // DO NOT REMOVE : this opacity value prevents webview to crash on Android. See https://github.com/react-native-webview/react-native-webview/issues/429
})

const LoadingPageContainer = styled.View({
  height: '100%',
  width: '100%',
})
