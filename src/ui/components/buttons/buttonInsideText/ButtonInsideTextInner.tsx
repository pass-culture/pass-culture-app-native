import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { Spacer } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

type Props = {
  wording: string
  typography?: 'ButtonText' | 'Caption'
  icon?: FunctionComponent<IconInterface>
  color?: ColorsEnum
}

export function ButtonInsideTextInner({
  wording,
  typography = 'ButtonText',
  icon: Icon,
  color,
}: Props) {
  const StyledIcon =
    Icon &&
    styled(Icon).attrs(({ theme }) => ({
      size: typography === 'Caption' ? theme.icons.sizes.extraSmall : theme.icons.sizes.smaller,
      color: color ?? theme.colors.primary,
    }))``

  return (
    <Container icon={Icon} typography={typography}>
      {!!StyledIcon && (
        <IconContainer>
          <StyledIcon testID="button-icon" />
          <Spacer.Row numberOfSpaces={1} />
        </IconContainer>
      )}
      <StyledText typography={typography} color={color}>
        {wording}
      </StyledText>
    </Container>
  )
}

const Container = styled.View<{
  icon?: FunctionComponent<IconInterface>
  typography?: string
}>(({ theme, icon, typography }) => {
  const iconSize =
    typography === 'Caption' ? theme.icons.sizes.extraSmall : theme.icons.sizes.smaller
  return {
    paddingLeft: icon ? iconSize * 1.25 : undefined, // Hack for add space between icon and label
  }
})

const IconContainer = styled.View({
  position: 'absolute',
  left: 0,
})

const StyledText = styled.Text<{
  typography?: string
  color?: ColorsEnum
  icon?: FunctionComponent<IconInterface>
}>(({ theme, typography, color }) => ({
  ...(typography === 'Caption' ? theme.typography.caption : theme.typography.buttonText),
  color: color ?? theme.colors.primary,
}))
