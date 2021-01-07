import React from 'react'
import { Button } from 'react-native'

import { useAuthContext, useLogoutRoutine } from 'features/auth/AuthContext'

export const LogoutButton = () => {
  const { isLoggedIn } = useAuthContext()
  const signOut = useLogoutRoutine()

  return (
    <Button
      testID="logoutButton"
      title="⚠️ Se déconnecter"
      onPress={signOut}
      disabled={!isLoggedIn}
    />
  )
}
