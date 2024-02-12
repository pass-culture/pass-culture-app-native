import React from 'react'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

interface Props {
  onPress: () => void
  isDisabled: boolean
  title: string
  subtitleLeft: string
  subtitleRight?: string
}
export const EventCard: React.FC<Props> = ({
  onPress,
  isDisabled,
  title,
  subtitleLeft,
  subtitleRight,
}) => {
  return (
    <StyledPressable onPress={onPress} disabled={isDisabled}>
      <Container isDisabled={isDisabled}>
        <Title accessibilityLabel={title} numberOfLines={1} isDisabled={isDisabled}>
          {title}
        </Title>
        <Spacer.Column numberOfSpaces={1} />
        <SubtitleContainer>
          <SubtitleLeft accessibilityLabel={subtitleLeft} numberOfLines={1} isDisabled={isDisabled}>
            {subtitleLeft}
          </SubtitleLeft>
          <SubtitleRight
            accessibilityLabel={subtitleRight}
            numberOfLines={1}
            isDisabled={isDisabled}>
            {subtitleRight}
          </SubtitleRight>
        </SubtitleContainer>
      </Container>
    </StyledPressable>
  )
}
const StyledPressable = styledButton(Touchable)<{ isFocus?: boolean }>(({ theme, isFocus }) => ({
  width: getSpacing(28),
  ...customFocusOutline({ isFocus, color: theme.colors.black }),
  '&:focus': {
    outlineOffset: getSpacing(0.75),
    outlineWidth: getSpacing(0.25),
    borderRadius: theme.borderRadius.radius,
  },
}))

const Container = styled.View<{ isDisabled: boolean }>(({ theme, isDisabled }) => ({
  display: 'inline-flex',
  backgroundColor: isDisabled ? theme.colors.greyLight : theme.colors.white,
  alignItems: 'flex-start',
  heigth: getSpacing(17),
  width: '100%',
  padding: getSpacing(3),
  borderRadius: theme.borderRadius.radius,
  borderWidth: isDisabled ? 0 : getSpacing(0.25),
  borderColor: theme.colors.black,
}))

const Title = styled(Typo.ButtonText)<{ isDisabled: boolean }>(({ theme, isDisabled }) => ({
  color: isDisabled ? theme.colors.greyDark : theme.colors.black,
}))

const SubtitleContainer = styled.View({
  alignSelf: 'stretch',
  flexDirection: 'row',
  width: '100%',
  alignItems: 'center',
})

const SubtitleLeft = styled(Typo.Caption)<{ isDisabled: boolean }>(({ theme, isDisabled }) => ({
  color: isDisabled ? theme.colors.greySemiDark : theme.colors.greyDark,
  lineHeight: getSpacing(5),
}))

const SubtitleRight = styled(Typo.Body)<{ isDisabled: boolean }>(({ theme, isDisabled }) => ({
  color: isDisabled ? theme.colors.greySemiDark : theme.colors.black,
  flexShrink: 0,
  paddingLeft: getSpacing(1),
}))
