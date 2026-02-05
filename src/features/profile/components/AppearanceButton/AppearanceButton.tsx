import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { StyledSectionRow } from 'features/profile/components/SectionRowWithPaddingVertical/SectionRowWithPaddingVertical'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagVariant } from 'ui/designSystem/Tag/types'
import { ArtMaterial } from 'ui/svg/icons/venueAndCategories/ArtMaterial'
import { Typo } from 'ui/theme'

type AppearanceButtonProps = {
  navigate: UseNavigationType['navigate']
  enableDarkModeGtm: boolean
  hasSeenAppearanceTag: boolean | null
  markAppearanceTagSeen: () => void
}

const TAG_LABEL = 'Nouveau'
const ACCESSIBILITY_LABEL = `Apparence - ${TAG_LABEL}`

export const AppearanceButton = ({
  navigate,
  enableDarkModeGtm,
  hasSeenAppearanceTag,
  markAppearanceTagSeen,
}: AppearanceButtonProps) => {
  const showTag = enableDarkModeGtm && !hasSeenAppearanceTag
  const onPress = () => {
    markAppearanceTagSeen()
    navigate('ProfileStackNavigator', { screen: 'Appearance' })
  }

  return (
    <StyledSectionRow
      title="Apparence"
      type="navigable"
      icon={ArtMaterial}
      accessibilityLabel={showTag ? ACCESSIBILITY_LABEL : undefined}
      onPress={onPress}
      renderTitle={(title) => (
        <TitleWithTag>
          <Typo.BodyAccent numberOfLines={2}>{title}</Typo.BodyAccent>
          {showTag ? <Tag label={TAG_LABEL} variant={TagVariant.NEW} /> : null}
        </TitleWithTag>
      )}
    />
  )
}

const TitleWithTag = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginRight: theme.designSystem.size.spacing.s,
}))
