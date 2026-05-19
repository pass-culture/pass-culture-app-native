import React, { ComponentType } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { Login } from 'features/auth/pages/login/Login'

export function withAuthProtection<TProps extends React.JSX.IntrinsicAttributes>(
  WrappedComponent: ComponentType<TProps>
) {
  return function ComponentWithAuthProtection(props: TProps) {
    const { isLoggedIn } = useAuthContext()
    if (!isLoggedIn) {
      return <Login doNotNavigateOnSigninSuccess />
    }
    return <WrappedComponent {...props} />
  }
}
