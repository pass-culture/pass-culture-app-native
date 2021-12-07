import { EduConnectError, EduConnectErrors, EduConnectErrorBoundary } from '@pass-culture/id-check'
import { ErrorTrigger } from '@pass-culture/id-check/src/errors/ErrorTrigger'
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useRef, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { URL } from 'react-native-url-polyfill'
import WebView, { WebViewNavigation } from 'react-native-webview'
import { WebViewSource } from 'react-native-webview/lib/WebViewTypes'
import styled from 'styled-components/native'

import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { useEduconnect } from 'features/identityCheck/utils/useEduConnect'
import { eduConnectClient } from 'libs/eduConnectClient'
import { ColorsEnum } from 'ui/theme'

export const IdentityCheckEduConnectForm = () => {
  const { navigateToNextScreen } = useIdentityCheckNavigation()
  const { dispatch } = useIdentityCheckContext()

  const webViewRef = useRef<WebView>(null)
  const [webViewSource, setWebViewSource] = useState<WebViewSource>()
  const { shouldUseEduConnect } = useEduconnect()
  const [error, setError] = useState<EduConnectError | null>(
    shouldUseEduConnect ? null : new EduConnectError(EduConnectErrors.unavailable)
  )

  const checkIfEduConnectIsAvailable = useCallback(() => {
    if (shouldUseEduConnect === false) {
      setError(new EduConnectError(EduConnectErrors.unavailable))
    }
  }, [shouldUseEduConnect])

  const loadWebView = useCallback(() => {
    function setWebView() {
      eduConnectClient
        ?.getAccessToken()
        .then((value) => {
          setWebViewSource({
            uri: eduConnectClient.getLoginUrl(),
            headers: { Authorization: `Bearer ${value}` },
          })
        })
        .catch(setError)
    }
    setWebView()
    return () => setWebViewSource(undefined)
  }, [eduConnectClient])

  useFocusEffect(
    useCallback(() => {
      checkIfEduConnectIsAvailable()
      return loadWebView()
    }, [checkIfEduConnectIsAvailable, loadWebView])
  )

  const onNavigationStateChange = (event: WebViewNavigation) => {
    // EduConnect could not display the login form
    if (event.title.startsWith('Erreur')) {
      setError(new EduConnectError(EduConnectErrors.unavailable, 'EduConnectServiceError'))
      return
    }
    // PC Api detected an error after EduConnect authentication
    const isError = event.url.includes('educonnect/erreur')
    if (isError) {
      if (event.url.includes('UserAgeNotValid')) {
        setError(new EduConnectError(EduConnectErrors['not-eligible'], 'UserAgeNotValid'))
      } else if (event.url.includes('UserNotWhitelisted')) {
        setError(new EduConnectError(EduConnectErrors['not-eligible'], 'UserNotWhitelisted'))
      } else if (event.url.includes('UserAlreadyBeneficiary')) {
        setError(new EduConnectError(EduConnectErrors['not-eligible'], 'UserAlreadyBeneficiary'))
      } else {
        setError(
          new EduConnectError(
            EduConnectErrors['not-eligible'],
            `UnspecifiedError URL error ${event.url}`
          )
        )
      }
      return
    }
    const isUserAuthenticated = event.url.includes('validation')
    if (isUserAuthenticated) {
      const url = new URL(event.url)
      const eduConnectLogoutUrl = url.searchParams.get('logoutUrl') ?? ''
      fetch(eduConnectLogoutUrl)
      dispatch({
        type: 'SET_IDENTIFICATION',
        payload: {
          firstName: url.searchParams.get('firstName') ?? null,
          lastName: url.searchParams.get('lastName') ?? null,
          birthDate: url.searchParams.get('dateOfBirth') ?? null,
          // TODO PC-12075 chekc what to do with country code
          countryCode: 'OK',
        },
      })
      navigateToNextScreen()
    }
  }

  const renderError = (errorDomain: string | undefined, errorCode: number, errorDesc: string) => {
    setError(
      new EduConnectError(
        EduConnectErrors.unavailable,
        `EduConnectForm fail to render Webview. errorDomain: ${errorDomain}, errorCode: ${errorCode}, errorDesc: ${errorDesc}`
      )
    )
    return <React.Fragment></React.Fragment>
  }

  return (
    <ErrorBoundary FallbackComponent={EduConnectErrorBoundary}>
      <PageWithHeader
        title="ÉduConnect"
        scrollChildren={
          webViewSource ? (
            <StyledWebView
              ref={webViewRef}
              source={webViewSource}
              onNavigationStateChange={onNavigationStateChange}
              renderError={renderError}
              incognito
            />
          ) : (
            <React.Fragment></React.Fragment>
          )
        }
      />
      <ErrorTrigger error={error} />
    </ErrorBoundary>
  )
}

const StyledWebView = styled(WebView)({
  flex: 1,
  backgroundColor: ColorsEnum.WHITE,
})
