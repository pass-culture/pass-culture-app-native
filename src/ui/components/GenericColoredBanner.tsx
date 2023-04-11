import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'

type ColorMessageProps = {
  textColor?: string
}

type Props = ColorMessageProps & {
  message: string
  backgroundColor: string
  Icon?: FunctionComponent<IconInterface>
  testID?: string
}

export const GenericColoredBanner: FunctionComponent<Props> = ({
  message,
  textColor,
  Icon,
  testID,
  children,
  backgroundColor,
}) => {
  return (
    <Container testID={testID} backgroundColor={backgroundColor}>
      {!!Icon && (
        <IconContainer>
          <Icon />
        </IconContainer>
      )}
      <TextContainer>
        <Caption textColor={textColor}>{message}</Caption>
        {children}
      </TextContainer>
    </Container>
  )
}

const Container = styled.View<{ backgroundColor: string }>(({ theme, backgroundColor }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: backgroundColor ? backgroundColor : theme.colors.secondaryLight,
  borderRadius: getSpacing(2),
  padding: getSpacing(4),
}))

const IconContainer = styled.View({
  paddingRight: getSpacing(4),
})

const TextContainer = styled.View({
  flex: 1,
})

const Caption = styled(Typo.Caption)<ColorMessageProps>(({ theme, textColor }) => ({
  color: textColor ? textColor : theme.colors.black,
}))
