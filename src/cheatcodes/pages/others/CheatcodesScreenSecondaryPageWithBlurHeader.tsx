import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { RightButtonText } from 'ui/components/headers/RightButtonText'
import { SecondaryPageWithNeutralHeader } from 'ui/pages/SecondaryPageWithNeutralHeader'
import { Typo } from 'ui/theme'

export const CheatcodesScreenSecondaryPageWithBlurHeader = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const navigateToCheatcodesNavigationGenericPages = () => {
    navigate('CheatcodesStackNavigator', { screen: 'CheatcodesNavigationGenericPages' })
  }
  return (
    <SecondaryPageWithNeutralHeader
      title="Titre"
      shouldDisplayBackButton
      onGoBack={navigateToCheatcodesNavigationGenericPages}
      RightButton={
        <RightButtonText onClose={navigateToCheatcodesNavigationGenericPages} wording="Quitter" />
      }>
      <Typo.Body>Children...</Typo.Body>
    </SecondaryPageWithNeutralHeader>
  )
}
