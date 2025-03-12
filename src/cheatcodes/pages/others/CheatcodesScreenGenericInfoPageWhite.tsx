import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { MaintenanceCone } from 'ui/svg/icons/MaintenanceCone'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { TypoDS } from 'ui/theme'

export const CheatcodesScreenGenericInfoPageWhite = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const navigateToCheatcodesNavigationGenericPages = () => {
    navigate('CheatcodesNavigationGenericPages')
  }
  return (
    <GenericInfoPageWhite
      withGoBack
      withSkipAction={navigateToCheatcodesNavigationGenericPages}
      illustration={MaintenanceCone}
      title="Title"
      subtitle="Subtitle"
      buttonPrimary={{
        wording: 'ButtonPrimary',
        navigateTo: { screen: 'CheatcodesNavigationGenericPages' },
      }}
      buttonSecondary={{
        wording: 'ButtonSecondary',
        onPress: navigateToCheatcodesNavigationGenericPages,
      }}
      buttonTertiary={{
        wording: 'ButtonTertiary',
        navigateTo: { screen: 'CheatcodesNavigationGenericPages' },
        icon: PlainArrowPrevious,
      }}>
      <TypoDS.Body>Children...</TypoDS.Body>
    </GenericInfoPageWhite>
  )
}
