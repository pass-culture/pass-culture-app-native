import {
  initialRouteName as idCheckInitialRouteName,
  useIdCheckContext,
  IdCheckError,
  IdCheckErrors,
} from '@pass-culture/id-check'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useEffect, useRef, useState } from 'react'
import { WebView, WebViewNavigation } from 'react-native-webview'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { api } from 'api/api'
import { useNotifyIdCheckCompleted } from 'features/auth/api'
import { useAppSettings } from 'features/auth/settings'
import { useUserProfileInfo } from 'features/home/api'
import {
  homeNavigateConfig,
  navigateToHome,
  openExternalUrl,
  useCurrentRoute,
} from 'features/navigation/helpers'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { QueryKeys } from 'libs/queryKeys'
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
  const { setContextValue } = useIdCheckContext()
  const queryClient = useQueryClient()

  const [idCheckUri, setIdCheckUri] = useState<string | undefined>(undefined)
  const [error, setError] = useState<Error | IdCheckError | null>(null)

  function onAbandon() {
    navigation.replace(homeNavigateConfig.screen, homeNavigateConfig.params)
  }

  const { mutate: notifyIdCheckCompleted } = useNotifyIdCheckCompleted({
    onSuccess: syncUserAndProceedToNextScreen,
    onError: syncUserAndProceedToNextScreen,
  })

  const { refetch } = useUserProfileInfo({
    cacheTime: 0,
  })

  function goToBeneficiaryRequestSent() {
    navigation.navigate('BeneficiaryRequestSent')
  }

  function syncUserAndProceedToNextScreen() {
    queryClient.invalidateQueries(QueryKeys.USER_PROFILE).finally(() => {
      refetch().finally(goToBeneficiaryRequestSent)
    })
  }

  function onSuccess() {
    notifyIdCheckCompleted()
  }

  useEffect(() => {
    if (setContextValue) {
      setContextValue({
        // necessary so we can use the id check v2 errors page with abandon button outside the id check v2 context (webview)
        onAbandon,
      })
    }
  }, [setContextValue])

  useEffect(() => {
    if (!areSettingsLoading && settings?.enableNativeIdCheckVersion) {
      const { email, licence_token, expiration_timestamp } = props.route.params
      navigation.navigate(idCheckInitialRouteName, {
        email,
        licence_token,
        expiration_timestamp,
      })
    }
  }, [settings?.enableNativeIdCheckVersion, areSettingsLoading])

  useEffect(() => {
    const { email, licence_token, expiration_timestamp } = props.route.params
    const encodedEmail = encodeURIComponent(email)
    storage.readObject<boolean>('has_accepted_cookie').then((hasAcceptedCookies) => {
      const userConsentDataCollection = hasAcceptedCookies ?? false
      const uri = `${env.ID_CHECK_URL}/?email=${encodedEmail}&user_consent_data_collection=${userConsentDataCollection}`
      if (licence_token && expiration_timestamp) {
        const expiration = expiration_timestamp
          ? `&expiration_timestamp=${expiration_timestamp}`
          : ''
        const token = `&licence_token=${licence_token}${expiration}`
        setIdCheckUri(uri + token + expiration)
      } else {
        api
          .getnativev1idCheckToken()
          .then(({ token: licence_token, token_timestamp }) => {
            const expiration = token_timestamp
              ? `&expiration_timestamp=${token_timestamp.getTime()}`
              : ''
            const token = `&licence_token=${licence_token}${expiration}`
            setIdCheckUri(uri + token + expiration)
          })
          .catch((err) => {
            if (err.name === 'ApiError' && err.content.code === 'TOO_MANY_ID_CHECK_TOKEN') {
              setError(new IdCheckError(IdCheckErrors['no-remaining-tries']))
            } else if (err.name === 'ApiError' && err.content.code === 'USER_NOT_ELIGIBLE') {
              setError(new IdCheckError(IdCheckErrors['not-eligible']))
            } else {
              setError(err as Error)
            }
          })
      }
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
      onSuccess()
    } else if (!settings?.displayDmsRedirection) {
      // this is double check as button is not shown on idCheck component
      return
    } else if (isRedirectedToDMS) {
      openExternalUrl(event.url)
      // we need to force the webview to go back otherwise it opens DMS url
      webviewRef.current?.goBack()
    }
  }

  if (error) {
    throw error
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
