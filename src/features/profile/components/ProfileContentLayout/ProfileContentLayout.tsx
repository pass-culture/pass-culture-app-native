import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { createProfileContent, SectionItem } from 'features/profile/helpers/createProfileContent'
import { AccessibleUnorderedList } from 'ui/components/accessibility/AccessibleUnorderedList'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Section = {
  section: string
  items: SectionItem[]
}

type Props = {
  config: Section[]
  testID?: string
}

export const ProfileContentLayout = ({ config, testID }: Props) => (
  <Container gap={2} testID={testID}>
    {config.map((section) => {
      if (section.items.length === 0) return null
      const items = section.items.map((item) => createProfileContent(item))
      return (
        <View key={section.section}>
          <CaptionNeutralInfo>{section.section}</CaptionNeutralInfo>
          <StyledSeparator />
          <AccessibleUnorderedList items={items} />
        </View>
      )
    })}
  </Container>
)

const Container = styled(ViewGap)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
}))

const CaptionNeutralInfo = styled(Typo.BodyAccentXs).attrs(getHeadingAttrs(2))(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const StyledSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.s,
}))
