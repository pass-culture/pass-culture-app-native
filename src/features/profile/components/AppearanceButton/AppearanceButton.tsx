import React from 'react'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { StyledSectionRow } from 'features/profile/components/SectionRowWithPaddingVertical/SectionRowWithPaddingVertical'
import { ArtMaterial } from 'ui/svg/icons/venueAndCategories/ArtMaterial'

type AppearanceButtonProps = {
  navigate: UseNavigationType['navigate']
}

export const AppearanceButton = ({ navigate }: AppearanceButtonProps) => {
  const onPress = () => navigate('ProfileStackNavigator', { screen: 'Appearance' })

  return (
    <StyledSectionRow title="Apparence" type="navigable" icon={ArtMaterial} onPress={onPress} />
  )
}
