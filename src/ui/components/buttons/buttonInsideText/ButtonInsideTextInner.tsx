import React, { FunctionComponent } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, Spacer } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

type Props = {
  wording: string
  typography?: 'ButtonText' | 'Caption'
  icon?: FunctionComponent<AccessibleIcon>
  color?: ColorsEnum
  disablePadding?: boolean
}

export function ButtonInsideTextInner({
  wording,
  typography = 'ButtonText',
  icon: Icon,
  color,
  disablePadding,
}: Props) {
  const StyledIcon =
    Icon &&
    styled(Icon).attrs(({ theme }) => ({
      size: typography === 'Caption' ? theme.icons.sizes.extraSmall : theme.icons.sizes.smaller,
      color: color ?? theme.colors.primary,
    }))``

  const hasIcon = !!Icon
  const paddingIcon = typography === 'Caption' ? getSpacing(1) : getSpacing(1.25)
  const hasPadding = hasIcon && Platform.OS === 'web' && !disablePadding
  const paddingForIcon = hasPadding ? paddingIcon : 0

  return (
    <Container paddingForIcon={paddingForIcon}>
      {StyledIcon ? (
        <React.Fragment>
          <StyledIcon testID="button-icon" />
          <Spacer.Row numberOfSpaces={1} />
        </React.Fragment>
      ) : null}
      <StyledText typography={typography} color={color}>
        {wording}
      </StyledText>
    </Container>
  )
}

const Container = styled.View<{
  paddingForIcon: number
}>(({ paddingForIcon }) => ({
  flexDirection: 'row',
  top: paddingForIcon,
}))

const StyledText = styled.Text<{
  typography?: string
  color?: ColorsEnum
}>(({ theme, typography, color }) => ({
  ...(typography === 'Caption' ? theme.typography.caption : theme.typography.buttonText),
  color: color ?? theme.colors.primary,
}))
