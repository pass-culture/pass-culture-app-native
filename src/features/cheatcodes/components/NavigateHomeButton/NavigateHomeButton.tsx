import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { Button } from 'react-native'

export const NavigateHomeButton: React.FC = () => {
  const { navigate } = useNavigation()
  const navigateToHome = useCallback(() => navigate('Home'), [])
  return <Button title="Navigate to Home" onPress={navigateToHome} />
}
