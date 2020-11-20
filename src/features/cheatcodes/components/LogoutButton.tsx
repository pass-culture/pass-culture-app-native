import React from 'react'
import { Button } from 'react-native'

import { useCurrentUser } from 'features/auth/api'
import { useAuthContext } from 'features/auth/AuthContext'

export const LogoutButton = () => {
  const { data: email } = useCurrentUser()
  const { isLoggedIn, signOut } = useAuthContext()

  return (
    <Button
      testID="logoutButton"
      title="⚠️ Se déconnecter"
      onPress={() => {
        email && signOut(email)
      }}
      disabled={!isLoggedIn || !email}
    />
  )
}
