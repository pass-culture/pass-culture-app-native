import React, { FunctionComponent, ReactNode } from 'react'
import styled from 'styled-components/native'

import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, TypoDS } from 'ui/theme'

type ColorMessageProps = {
  textColor?: string
}

type Props = ColorMessageProps & {
  message: string | ReactNode
  backgroundColor?: string
  children?: React.ReactNode
  Icon?: FunctionComponent<AccessibleIcon>
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
      {Icon ? (
        <IconContainer>
          <Icon />
        </IconContainer>
      ) : null}
      <TextContainer>
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
  backgroundColor: backgroundColor || theme.colors.secondaryLight100,
  borderRadius: getSpacing(2),
  padding: getSpacing(4),
}))

const IconContainer = styled.View({
  paddingRight: getSpacing(4),
})

const TextContainer = styled.View({
  flex: 1,
})

const Caption = styled(TypoDS.BodyAccentXs)<ColorMessageProps>(({ theme, textColor }) => ({
  color: textColor || theme.colors.black,
}))
