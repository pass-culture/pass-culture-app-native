import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'

type ColorMessageProps = {
  withLightColorMessage?: boolean
}

type Props = ColorMessageProps & {
  message: string
  icon?: FunctionComponent<IconInterface>
  testID?: string
}

export const InfoBanner: FunctionComponent<Props> = ({
  message,
  withLightColorMessage,
  icon,
  testID,
  children,
}) => {
  const Icon =
    icon &&
    styled(icon).attrs(({ theme }) => ({
      color: theme.colors.greyDark,
      color2: theme.colors.greyDark,
      size: theme.icons.sizes.small,
    }))``

  return (
    <Container testID={testID}>
      {!!Icon && (
        <IconContainer>
          <Icon />
        </IconContainer>
      )}
      <TextContainer>
        <Caption withLightColorMessage={!!withLightColorMessage}>{message}</Caption>
        {children}
      </TextContainer>
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: theme.colors.secondaryLight,
  borderRadius: getSpacing(2),
  padding: getSpacing(4),
}))

const IconContainer = styled.View({
  paddingRight: getSpacing(4),
})

const TextContainer = styled.View({
  flex: 1,
})

const Caption = styled(Typo.Caption)<ColorMessageProps>(({ theme, withLightColorMessage }) => ({
  color: withLightColorMessage ? theme.colors.greyDark : theme.colors.black,
}))
