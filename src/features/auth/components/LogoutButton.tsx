import React from 'react'
import { Button } from 'react-native'

import { useAuthContext } from 'features/auth/AuthContext'

export const LogoutButton = () => {
  const { isLoggedIn, signOut } = useAuthContext()
  return (
    <Button
      testID="logoutButton"
      title="⚠️ Se déconnecter"
      onPress={signOut}
      disabled={!isLoggedIn}
    />
  )
}
