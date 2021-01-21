import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { Button } from 'react-native'

import { UseNavigationType } from 'features/navigation/RootNavigator'

export const NavigateHomeButton: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const navigateToHome = useCallback(() => navigate('Home', { shouldDisplayLoginModal: false }), [])
  return <Button title="Naviguer vers la page d'accueil" onPress={navigateToHome} />
}
