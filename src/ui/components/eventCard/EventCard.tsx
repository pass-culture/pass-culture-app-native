import React from 'react'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { getShadow, getSpacing, Spacer, Typo } from 'ui/theme'

const BORDER_WIDTH = getSpacing(0.25)
const EVENT_CARD_HEIGHT = getSpacing(17)
export const EVENT_CARD_WIDTH = getSpacing(30)

export type EventCardProps = {
  onPress: () => void
  isDisabled: boolean
  title: string
  subtitleLeft: string
  subtitleRight?: string
}

export const EventCard: React.FC<EventCardProps> = ({
  onPress,
  isDisabled,
  title,
  subtitleLeft,
  subtitleRight,
}) => {
  const hasSubtitleRight = !!subtitleRight
  return (
    <StyledTouchableOpacity testID="event-card" disabled={isDisabled} onPress={onPress}>
      <Title accessibilityLabel={title} numberOfLines={1} disabled={isDisabled}>
        {title}
      </Title>

      <Spacer.Column numberOfSpaces={1} />
      <SubtitleContainer>
        <SubtitleLeft
          accessibilityLabel={subtitleLeft}
          numberOfLines={1}
          disabled={isDisabled}
          hasSubtitleRight={hasSubtitleRight}>
          {subtitleLeft}
        </SubtitleLeft>
        {hasSubtitleRight ? (
          <React.Fragment>
            <Spacer.Row numberOfSpaces={1} />
            <SubtitleRight
              accessibilityLabel={subtitleRight}
              numberOfLines={1}
              disabled={isDisabled}>
              {subtitleRight}
            </SubtitleRight>
          </React.Fragment>
        ) : null}
      </SubtitleContainer>
    </StyledTouchableOpacity>
  )
}

const StyledTouchableOpacity = styledButton(Touchable)<{ disabled: boolean }>(
  ({ theme, disabled }) => ({
    width: EVENT_CARD_WIDTH,
    height: EVENT_CARD_HEIGHT,
    boxSizing: 'border-box',
    padding: getSpacing(3),
    justifyContent: 'flex-start',
    borderWidth: disabled ? 0 : BORDER_WIDTH,
    borderRadius: theme.borderRadius.radius,
    backgroundColor: disabled ? theme.colors.greyLight : theme.colors.white,
    ...(disabled
      ? {}
      : getShadow({
          shadowOffset: { width: 0, height: getSpacing(1) },
          shadowRadius: getSpacing(1),
          shadowColor: theme.colors.greyDark,
          shadowOpacity: 0.2,
        })),
  })
)

const Title = styled(Typo.ButtonText)<{ disabled: boolean }>(({ theme, disabled }) => ({
  color: disabled ? theme.colors.greyDark : theme.colors.black,
  textAlign: 'left',
}))

const SubtitleContainer = styled.View({
  alignSelf: 'stretch',
  flexDirection: 'row',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  textOverflow: 'ellipsis',
})

const SubtitleLeft = styled(Typo.Caption)<{ disabled: boolean; hasSubtitleRight: boolean }>(
  ({ theme, disabled, hasSubtitleRight }) => ({
    color: disabled ? theme.colors.greySemiDark : theme.colors.greyDark,
    lineHeight: `${getSpacing(5)}px`,
    textAlign: 'left',
    flex: hasSubtitleRight ? 'auto' : 1,
  })
)

const SubtitleRight = styled(Typo.Body)<{ disabled: boolean }>(({ theme, disabled }) => ({
  color: disabled ? theme.colors.greySemiDark : theme.colors.black,
  textAlign: 'right',
  flexShrink: 0,
  flexGrow: 1,
}))
