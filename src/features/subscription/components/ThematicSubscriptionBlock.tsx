import React from 'react'
import styled from 'styled-components/native'

import { SubscriptionThematicIllustration } from 'features/subscription/components/SubscriptionThematicIllustration'
import { mapSubscriptionThematicToBlockTitles } from 'features/subscription/helpers/mapSubscriptionThematicToBlockTitles'
import { useIconWiggle } from 'features/subscription/helpers/useIconWiggle'
import { SubscriptionTheme } from 'features/subscription/types'
import { Button } from 'ui/designSystem/Button/Button'
import { ButtonContainerFlexStart } from 'ui/designSystem/Button/ButtonContainerFlexStart'
import { Bell } from 'ui/svg/icons/Bell'
import { BellFilled } from 'ui/svg/icons/BellFilled'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

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
  const { iconAnimatedStyle, trigger } = useIconWiggle()
  const subscribeButtonWording = isSubscribeButtonActive ? 'Thème suivi' : 'Suivre le thème'
  const subscribeButtonA11yLabel = isSubscribeButtonActive ? 'Thème déjà suivi' : 'Suivre le thème'

  const onSubscribeButtonPress = () => {
    if (!isSubscribeButtonActive) trigger()
    onSubscribePress()
  }

  return (
    <Container>
      <SubscriptionThematicIllustration thematic={thematic} size="medium" />
      <ContentContainer>
        <Typo.BodyAccent {...getHeadingAttrs(2)}>{title}</Typo.BodyAccent>
        <Subtitle>{subtitle}</Subtitle>
        <ButtonContainerFlexStart>
          <Button
            wording={subscribeButtonWording}
            onPress={onSubscribeButtonPress}
            icon={isSubscribeButtonActive ? ActiveBellIcon : Bell}
            size="small"
            variant="secondary"
            color="neutral"
            accessibilityLabel={subscribeButtonA11yLabel}
            iconAnimatedStyle={iconAnimatedStyle}
          />
        </ButtonContainerFlexStart>
      </ContentContainer>
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flexDirection: 'row',
  marginHorizontal: theme.designSystem.size.spacing.l,
  marginVertical: theme.designSystem.size.spacing.xl,
  gap: theme.designSystem.size.spacing.l,
}))

const ContentContainer = styled.View({
  flexShrink: 1,
})

const Subtitle = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
  marginBottom: theme.designSystem.size.spacing.s,
}))

const ActiveBellIcon = styled(BellFilled).attrs(({ theme }) => ({
  color: theme.designSystem.color.background.brandPrimary,
}))``
