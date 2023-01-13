import React, { ComponentType } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { Login } from 'features/auth/login/Login'

type Props = any // eslint-disable-line @typescript-eslint/no-explicit-any

export function withAuthProtection(WrappedComponent: ComponentType<Props>) {
  return function ComponentWithAuthProtection(props: Props) {
    const { isLoggedIn } = useAuthContext()
    if (!isLoggedIn) {
      return <Login doNotNavigateOnSigninSuccess />
    }
    return <WrappedComponent {...props} />
  }
}
