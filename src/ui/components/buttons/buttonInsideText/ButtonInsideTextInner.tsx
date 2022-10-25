import React, { FunctionComponent } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Spacer } from 'ui/theme'
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
    <Container hasIcon={!!Icon}>
      {!!StyledIcon && (
        <React.Fragment>
          <StyledIcon testID="button-icon" />
          <Spacer.Row numberOfSpaces={1} />
        </React.Fragment>
      )}
      <StyledText typography={typography} color={color}>
        {wording}
      </StyledText>
    </Container>
  )
}

const Container = styled.View<{
  hasIcon: boolean
}>(({ hasIcon }) => ({
  flexDirection: 'row',
  top: hasIcon && Platform.OS === 'web' ? getSpacing(1) : 0,
}))

const StyledText = styled.Text<{
  typography?: string
  color?: ColorsEnum
}>(({ theme, typography, color }) => ({
  ...(typography === 'Caption' ? theme.typography.caption : theme.typography.buttonText),
  color: color ?? theme.colors.primary,
}))
