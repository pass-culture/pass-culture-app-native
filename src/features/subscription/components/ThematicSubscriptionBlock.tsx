import React from 'react'
import styled from 'styled-components/native'

import { SubscribeButton } from 'features/subscription/components/buttons/SubscribeButton'
import { SubscriptionThematicIllustration } from 'features/subscription/components/SubscriptionThematicIllustration'
import { mapSubscriptionThematicToBlockTitles } from 'features/subscription/helpers/mapSubscriptionThematicToBlockTitles'
import { SubscriptionTheme } from 'features/subscription/types'
import { getSpacing, Typo } from 'ui/theme'

interface Props {
  thematic: SubscriptionTheme
  onSubscribePress: () => void
  isSubscribeButtonActive: boolean
}

export const ThematicSubscriptionBlock = ({
  thematic,
  onSubscribePress,
  isSubscribeButtonActive,
}: Props) => {
  const { title, subtitle } = mapSubscriptionThematicToBlockTitles[thematic]

  return (
    <Container>
      <SubscriptionThematicIllustration thematic={thematic} size="M" />
      <ContentContainer>
        <Typo.ButtonText>{title}</Typo.ButtonText>
        <Typo.CaptionNeutralInfo>{subtitle}</Typo.CaptionNeutralInfo>
        <SubscribeButton onPress={onSubscribePress} active={isSubscribeButtonActive} hasLongTitle />
      </ContentContainer>
    </Container>
  )
}

const Container = styled.View({
  flexDirection: 'row',
  margin: getSpacing(6),
  gap: getSpacing(4),
})

const ContentContainer = styled.View({
  gap: getSpacing(2),
  flexShrink: 1,
})
