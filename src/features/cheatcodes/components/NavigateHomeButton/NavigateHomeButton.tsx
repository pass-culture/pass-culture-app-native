import React from 'react'
import { Button } from 'react-native'

import { navigateToHome } from 'features/navigation/helpers'

export const NavigateHomeButton: React.FC = () => {
  return <Button title="Naviguer vers la page d'accueil" onPress={navigateToHome} />
}
