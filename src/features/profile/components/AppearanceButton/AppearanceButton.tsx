import React from 'react'

import { getProfilePropConfig } from 'features/navigation/navigators/ProfileStackNavigator/getProfilePropConfig'
import { StyledSectionRow } from 'features/profile/components/SectionRowWithPaddingVertical/SectionRowWithPaddingVertical'
import { ArtMaterial } from 'ui/svg/icons/venueAndCategories/ArtMaterial'

export const AppearanceButton = () => (
  <StyledSectionRow
    title="Apparence"
    type="navigable"
    icon={ArtMaterial}
    navigateTo={getProfilePropConfig('Appearance')}
  />
)
