import React, { ComponentType } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { Login } from 'features/auth/pages/login/Login'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = any

export function withAuthProtection(WrappedComponent: ComponentType<Props>) {
  return function ComponentWithAuthProtection(props: Props) {
    const { isLoggedIn } = useAuthContext()
    if (!isLoggedIn) {
      return <Login doNotNavigateOnSigninSuccess />
    }
    return <WrappedComponent {...props} />
  }
}
