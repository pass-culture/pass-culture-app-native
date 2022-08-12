import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useRef, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { URL } from 'react-native-url-polyfill'
import WebView, { WebViewNavigation } from 'react-native-webview'
import { WebViewSource } from 'react-native-webview/lib/WebViewTypes'
import styled from 'styled-components/native'

import { ErrorTrigger } from 'features/identityCheck/atoms/ErrorTrigger'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { EduConnectErrorBoundary } from 'features/identityCheck/pages/identification/errors/eduConnect/EduConnectErrorBoundary'
import { EduConnectError } from 'features/identityCheck/pages/identification/errors/eduConnect/types'
import { EduConnectErrorMessageEnum } from 'features/identityCheck/pages/identification/errors/hooks/useNotEligibleEduConnectErrorData'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { eduConnectClient } from 'libs/eduConnectClient'

export const IdentityCheckEduConnectForm = () => {
  const { navigateToNextScreen } = useIdentityCheckNavigation()
  const { dispatch } = useIdentityCheckContext()

  const webViewRef = useRef<WebView>(null)
  const [webViewSource, setWebViewSource] = useState<WebViewSource>()
  const [error, setError] = useState<EduConnectError | Error | null>(null)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eduConnectClient])

  useFocusEffect(
    useCallback(() => {
      loadWebView()
    }, [loadWebView])
  )

  const onNavigationStateChange = (event: WebViewNavigation) => {
    // PC Api detected an error after EduConnect authentication
    const isError = event.url.includes('educonnect/erreur')
    if (isError) {
      if (event.url.includes('UserAgeNotValid18YearsOld')) {
        setError(new EduConnectError(EduConnectErrorMessageEnum.UserAgeNotValid18YearsOld))
      } else if (event.url.includes('UserAgeNotValid')) {
        setError(new EduConnectError(EduConnectErrorMessageEnum.UserAgeNotValid))
      } else if (event.url.includes('UserTypeNotStudent')) {
        setError(new EduConnectError(EduConnectErrorMessageEnum.UserTypeNotStudent))
      } else {
        setError(new Error(EduConnectErrorMessageEnum.UnknownErrorCode))
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
        },
      })
      navigateToNextScreen()
    }
  }

  const renderError = (errorDomain: string | undefined, errorCode: number, errorDesc: string) => {
    setError(
      new Error(
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

const StyledWebView = styled(WebView)(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))
