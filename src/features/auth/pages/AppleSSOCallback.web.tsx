import { useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'

import { AccountState } from 'api/gen'
import { getSSOErrorMessage } from 'features/auth/helpers/getSSOErrorMessage'
import { useSignInMutation } from 'features/auth/queries/useSignInMutation'
import { SignInResponseFailure } from 'features/auth/types'
import { resetFromRef } from 'features/navigation/navigationRef'
import {
  RootStackParamList,
  StepperOrigin,
  UseRouteType,
} from 'features/navigation/navigators/RootNavigator/types'
import { eventMonitoring } from 'libs/monitoring/services'
import {
  clearAppleSSOContext,
  loadAppleSSOContext,
} from 'libs/react-native-apple-sso/appleSSOContext'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { LoadingPage } from 'ui/pages/LoadingPage'

/**
 * Web-only callback page for Apple Sign In (redirect flow).
 * Apple redirects here with ?code=xxx&state=yyy (response_mode=query).
 * This component extracts the params, calls the sign-in API, and handles navigation.
 *
 * All navigation uses resetFromRef() (not navigate()) to fully replace the navigation
 * stack. This prevents the component from staying mounted after loginRoutine changes
 * the auth state, which would cause remounts with lost state.
 */
export const AppleSSOCallback = () => {
  const route = useRoute<UseRouteType<'AppleSSOCallback'>>()
  const context = useMemo(() => loadAppleSSOContext(), [])
  const hasSignedIn = useRef(false)

  const navigateBack = useCallback(() => {
    if (context?.type === 'signup') {
      resetFromRef('SignupForm', context.params as RootStackParamList['SignupForm'])
    } else {
      resetFromRef('Login', context?.params as RootStackParamList['Login'])
    }
  }, [context])

  const handleFailure = useCallback(
    (error: SignInResponseFailure) => {
      const failureCode = error.content?.code

      eventMonitoring.captureException(
        new Error(`Apple SSO sign-in failed: ${failureCode ?? 'unknown'}`),
        {
          extra: {
            statusCode: error.statusCode,
            code: failureCode,
            content: error.content,
            provider: error.provider,
          },
        }
      )

      if (failureCode === 'SSO_EMAIL_NOT_FOUND') {
        resetFromRef('SignupForm', {
          accountCreationToken: error.content?.accountCreationToken,
          email: error.content?.email,
          from: context?.type === 'signup' ? StepperOrigin.SIGNUP : StepperOrigin.LOGIN,
          ssoProvider: 'apple',
        })
      } else if (failureCode === 'SSO_ERROR') {
        showErrorSnackBar(
          getSSOErrorMessage('apple', context?.type === 'signup' ? 'signup' : 'login')
        )
        navigateBack()
      } else if (failureCode === 'NETWORK_REQUEST_FAILED') {
        showErrorSnackBar('Erreur réseau. Tu peux réessayer une fois la connexion réétablie.')
        navigateBack()
      } else if (error.statusCode === 429 || failureCode === 'TOO_MANY_ATTEMPTS') {
        showErrorSnackBar('Nombre de tentatives dépassé. Réessaye dans 1 minute.')
        navigateBack()
      } else {
        showErrorSnackBar('Une erreur est survenue avec Apple, veuillez réessayer.')
        navigateBack()
      }
    },
    [context?.type, navigateBack]
  )

  const { mutateAsync: signInAsync } = useSignInMutation({
    params: context?.params,
    doNotNavigateOnSigninSuccess: true,
    onFailure: handleFailure,
    analyticsType: context?.type === 'signup' ? 'SSO_signup' : 'SSO_login',
    analyticsMethod: context?.type === 'signup' ? 'fromSignup' : 'fromLogin',
  })

  useEffect(() => {
    if (hasSignedIn.current) return

    // Context null = already consumed by a previous mount (Strict Mode / remount).
    // The sign-in triggered by the first mount is already in progress — do nothing.
    if (!context) return

    const code = route.params?.code
    const appleState = route.params?.state
    const error = route.params?.error

    if (error || !code || !appleState) {
      clearAppleSSOContext()
      navigateBack()
      return
    }

    // Validate that the state returned by Apple matches the original token (CSRF protection)
    if (appleState !== context.oauthStateToken) {
      clearAppleSSOContext()
      showErrorSnackBar('Une erreur est survenue avec Apple, veuillez réessayer.')
      navigateBack()
      return
    }

    // Set guards SYNCHRONOUSLY before any async work:
    // - hasSignedIn prevents re-execution within the same mount
    // - clearAppleSSOContext invalidates sessionStorage so subsequent mounts see null
    hasSignedIn.current = true
    clearAppleSSOContext()

    const doSignIn = async () => {
      try {
        const response = await signInAsync({
          authorizationCode: code,
          oauthStateToken: context.oauthStateToken,
          provider: 'apple' as const,
        })

        if (response.accountState === AccountState.ACTIVE) {
          resetFromRef('TabNavigator')
        } else {
          resetFromRef('AccountStatusScreenHandler')
        }
      } catch {
        // Errors are already handled by handleFailure (via onError → onFailure).
        // This catch handles the rethrow from mutateAsync.
      }
    }

    void doSignIn()
  }, [context, navigateBack, route.params, signInAsync])

  return <LoadingPage />
}
