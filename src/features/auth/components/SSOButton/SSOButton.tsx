import { useRoute } from '@react-navigation/native'
import React from 'react'

import { useSignIn } from 'features/auth/api/useSignIn'
import { SignInResponseFailure } from 'features/auth/types'
import { UseRouteType } from 'features/navigation/RootNavigator/types'

import { SSOButtonBase } from './SSOButtonBase'

type Props = {
  type: 'signup' | 'login'
  onSignInFailure?: (error: SignInResponseFailure) => void
}

export const SSOButton = ({ type, onSignInFailure }: Props) => {
  const { params } = useRoute<UseRouteType<'SignupForm'>>()
  const isSignupButton = type === 'signup'
  const { mutate: signIn } = useSignIn({
    params,
    onFailure: (error) => onSignInFailure?.(error),
    analyticsType: isSignupButton ? 'SSO_signup' : 'SSO_login',
    analyticsMethod: isSignupButton ? 'fromSignup' : 'fromLogin',
  })

  return <SSOButtonBase type={type} onSuccess={signIn} />
}
