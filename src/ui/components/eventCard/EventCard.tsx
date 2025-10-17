import React from 'react'
import styled from 'styled-components/native'

import { Referrals } from 'features/navigation/RootNavigator/types'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { getComputedAccessibilityLabel } from 'shared/accessibility/getComputedAccessibilityLabel'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { getSpacing, Typo } from 'ui/theme'

const BORDER_WIDTH = getSpacing(0.25)
export const EVENT_CARD_HEIGHT = getSpacing(19)
export const EVENT_CARD_WIDTH = getSpacing(30)

export type EventCardProps = {
  onPress: () => void
  isDisabled: boolean
  title: string
  subtitleLeft: string
  subtitleRight?: string
  analyticsFrom?: Referrals
}

export const EventCard: React.FC<EventCardProps & { offerId?: number }> = ({
  onPress,
  isDisabled,
  title,
  subtitleLeft,
  subtitleRight,
  analyticsFrom,
  offerId,
}) => {
  const hasSubtitleRight = !!subtitleRight
  const handleEventCardPress = () => {
    if (analyticsFrom === 'venue' && offerId !== undefined) {
      triggerConsultOfferLog({ offerId, from: analyticsFrom })
    }
    onPress()
  }

  const computedAccessibilityLabel = getComputedAccessibilityLabel(
    title,
    subtitleLeft,
    subtitleRight
  )

  return (
    <StyledTouchableOpacity
      testID="event-card"
      disabled={isDisabled}
      onPress={handleEventCardPress}
      accessibilityLabel={computedAccessibilityLabel}>
      <Title numberOfLines={1} disabled={isDisabled}>
        {title}
      </Title>
      <SubtitleContainer>
        <SubtitleLeft numberOfLines={1} disabled={isDisabled} hasSubtitleRight={hasSubtitleRight}>
          {subtitleLeft}
        </SubtitleLeft>
        {hasSubtitleRight ? (
          <SubtitleRight numberOfLines={1} disabled={isDisabled}>
            {subtitleRight}
          </SubtitleRight>
        ) : null}
      </SubtitleContainer>
    </StyledTouchableOpacity>
  )
}

const StyledTouchableOpacity = styledButton(Touchable)<{ disabled: boolean }>(
  ({ theme, disabled }) => ({
    minWidth: EVENT_CARD_WIDTH,
    minHeight: EVENT_CARD_HEIGHT,
    boxSizing: 'border-box',
    padding: theme.designSystem.size.spacing.m,
    justifyContent: 'flex-start',
    borderColor: theme.designSystem.color.border.default,
    borderWidth: disabled ? 0 : BORDER_WIDTH,
    borderRadius: theme.designSystem.size.borderRadius.m,
    backgroundColor: disabled
      ? theme.designSystem.color.background.disabled
      : theme.designSystem.color.background.default,
  })
)

const Title = styled(Typo.Button)<{ disabled: boolean }>(({ theme, disabled }) => ({
  color: disabled ? theme.designSystem.color.text.disabled : theme.designSystem.color.text.default,
  textAlign: 'left',
}))

const SubtitleContainer = styled.View({
  alignSelf: 'stretch',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  textOverflow: 'ellipsis',
})

const SubtitleLeft = styled(Typo.BodyAccentXs)<{
  disabled: boolean
  hasSubtitleRight: boolean
}>(({ theme, disabled, hasSubtitleRight }) => ({
  color: disabled ? theme.designSystem.color.text.disabled : theme.designSystem.color.text.subtle,
  lineHeight: `${theme.designSystem.size.spacing.xl}px`,
  textAlign: 'left',
  flex: hasSubtitleRight ? 'auto' : 1,
}))

const SubtitleRight = styled(Typo.Body)<{ disabled: boolean }>(({ theme, disabled }) => ({
  marginLeft: theme.designSystem.size.spacing.xs,
  color: disabled ? theme.designSystem.color.text.disabled : theme.designSystem.color.text.default,
  textAlign: 'right',
  flexShrink: 0,
  flexGrow: 1,
}))
