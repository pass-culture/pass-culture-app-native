import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { RightButtonText } from 'ui/components/headers/RightButtonText'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Typo } from 'ui/theme'

export const CheatcodesScreenSecondaryPageWithBlurHeader = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const navigateToCheatcodesNavigationGenericPages = () => {
    navigate('CheatcodesNavigationGenericPages')
  }
  return (
    <SecondaryPageWithBlurHeader
      title="Titre"
      shouldDisplayBackButton
      onGoBack={navigateToCheatcodesNavigationGenericPages}
      RightButton={
        <RightButtonText onClose={navigateToCheatcodesNavigationGenericPages} wording="Quitter" />
      }>
      <Typo.Body>Children...</Typo.Body>
    </SecondaryPageWithBlurHeader>
  )
}
