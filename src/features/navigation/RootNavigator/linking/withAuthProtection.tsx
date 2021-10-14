import React from 'react'
import { ComponentType } from 'react'

import { useAuthContext } from 'features/auth/AuthContext'
import { Login } from 'features/auth/login/Login'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withAuthProtection(WrappedComponent: ComponentType<any>, requireLogin: boolean) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function ComponentWithAuthProtection(props: any) {
    const { isLoggedIn } = useAuthContext()
    if (requireLogin && !isLoggedIn) {
      return <Login doNotNavigateOnSigninSuccess />
    }
    return <WrappedComponent {...props} />
  }
}
