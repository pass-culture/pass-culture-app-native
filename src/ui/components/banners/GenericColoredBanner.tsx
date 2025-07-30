import React, { FunctionComponent, ReactNode } from 'react'
import { ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'

type ColorMessageProps = {
  textColor?: string
}

type Props = ColorMessageProps & {
  message: string | ReactNode
  backgroundColor?: string
  children?: React.ReactNode
  Icon?: FunctionComponent<AccessibleIcon>
  testID?: string
  messageContainerStyle?: ViewStyle
}

export const GenericColoredBanner: FunctionComponent<Props> = ({
  message,
  textColor,
  Icon,
  testID,
  children,
  backgroundColor,
  messageContainerStyle,
}) => {
  return (
    <Container testID={testID} backgroundColor={backgroundColor}>
      {Icon ? (
        <IconContainer>
          <Icon />
        </IconContainer>
      ) : null}
      <TextContainer style={messageContainerStyle}>
        <Caption textColor={textColor}>{message}</Caption>
        {children}
      </TextContainer>
    </Container>
  )
}

const Container = styled.View<{ backgroundColor?: string }>(({ theme, backgroundColor }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: backgroundColor || theme.designSystem.color.background.info,
  borderRadius: theme.designSystem.size.borderRadius.m,
  padding: getSpacing(4),
}))

const IconContainer = styled.View({
  paddingRight: getSpacing(4),
})

const TextContainer = styled.View({
  flex: 1,
})

const Caption = styled(Typo.BodyAccentXs)<ColorMessageProps>(({ theme, textColor }) => ({
  color: textColor || theme.designSystem.color.text.default,
}))
