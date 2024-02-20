import React from 'react'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { getShadow, getSpacing, Spacer, Typo } from 'ui/theme'

const BORDER_WIDTH = getSpacing(0.25)
const CARD_HEIGHT = getSpacing(17)
const CARD_WIDTH = getSpacing(30)

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
    <StyledTouchableOpacity onPress={isDisabled ? undefined : onPress} isDisabled={isDisabled}>
      <Container isDisabled={isDisabled}>
        <Title accessibilityLabel={title} numberOfLines={1} isDisabled={isDisabled}>
          {title}
        </Title>
        <Spacer.Column numberOfSpaces={1} />
        <SubtitleContainer>
          <SubtitleLeft
            accessibilityLabel={subtitleLeft}
            numberOfLines={1}
            isDisabled={isDisabled}
            hasSubtitleRight={hasSubtitleRight}>
            {subtitleLeft}
          </SubtitleLeft>
          {hasSubtitleRight ? (
            <React.Fragment>
              <Spacer.Row numberOfSpaces={1} />
              <SubtitleRight
                accessibilityLabel={subtitleRight}
                numberOfLines={1}
                isDisabled={isDisabled}>
                {subtitleRight}
              </SubtitleRight>
            </React.Fragment>
          ) : null}
        </SubtitleContainer>
      </Container>
    </StyledTouchableOpacity>
  )
}
const StyledTouchableOpacity = styledButton(Touchable)<{ isDisabled: boolean }>(
  ({ theme, isDisabled }) => ({
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: theme.borderRadius.radius,
    ...(theme.isNative
      ? {}
      : {
          '&:hover': { textDecoration: isDisabled ? 'none' : 'underline' },
          '&:focus': { outline: 'none' },
          '&:focus-visible': { outline: 'auto' },
        }),
  })
)

const Container = styled.View<{ isDisabled: boolean }>(({ theme, isDisabled }) => ({
  width: CARD_WIDTH,
  height: CARD_HEIGHT,
  borderColor: isDisabled ? theme.colors.greyLight : theme.colors.black,
  borderWidth: BORDER_WIDTH,
  borderRadius: theme.borderRadius.radius,
  boxSizing: 'border-box',
  padding: getSpacing(3),
  justifyContent: 'flex-start',
  backgroundColor: isDisabled ? theme.colors.greyLight : theme.colors.white,
  ...(!isDisabled
    ? getShadow({
        shadowOffset: { width: 0, height: getSpacing(1) },
        shadowRadius: getSpacing(1),
        shadowColor: theme.colors.greyDark,
        shadowOpacity: 0.2,
      })
    : {}),
}))

const Title = styled(Typo.ButtonText)<{ isDisabled: boolean }>(({ theme, isDisabled }) => ({
  color: isDisabled ? theme.colors.greyDark : theme.colors.black,
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

const SubtitleLeft = styled(Typo.Caption)<{ isDisabled: boolean; hasSubtitleRight: boolean }>(
  ({ theme, isDisabled, hasSubtitleRight }) => ({
    color: isDisabled ? theme.colors.greySemiDark : theme.colors.greyDark,
    lineHeight: `${getSpacing(5)}px`,
    textAlign: 'left',
    flex: hasSubtitleRight ? 'auto' : 1,
  })
)

const SubtitleRight = styled(Typo.Body)<{ isDisabled: boolean }>(({ theme, isDisabled }) => ({
  color: isDisabled ? theme.colors.greySemiDark : theme.colors.black,
  textAlign: 'right',
  flexShrink: 0,
  flexGrow: 1,
}))
