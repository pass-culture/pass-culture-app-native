import React, { FunctionComponent } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { ColorsType } from 'theme/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports

type Props = {
  wording: string
  typography?: 'Button' | 'BodyAccentXs'
  icon?: FunctionComponent<AccessibleIcon>
  color?: ColorsType
  disablePadding?: boolean
}

export function ButtonInsideTextInner({
  wording,
  typography = 'Button',
  icon: Icon,
  color,
  disablePadding,
}: Props) {
  const StyledIcon =
    Icon &&
    styled(Icon).attrs(({ theme }) => ({
      size:
        typography === 'BodyAccentXs' ? theme.icons.sizes.extraSmall : theme.icons.sizes.smaller,
      color: color ?? theme.designSystem.color.icon.brandPrimary,
    }))``

  const hasIcon = !!Icon
  const paddingIcon = typography === 'BodyAccentXs' ? getSpacing(1) : getSpacing(1.25)
  const hasPadding = hasIcon && Platform.OS === 'web' && !disablePadding
  const paddingForIcon = hasPadding ? paddingIcon : 0

  return (
    <Container paddingForIcon={paddingForIcon} gap={1}>
      {StyledIcon ? <StyledIcon testID="button-icon" /> : null}
      <StyledText typography={typography} color={color}>
        {wording}
      </StyledText>
    </Container>
  )
}

const Container = styled(ViewGap)<{
  paddingForIcon: number
}>(({ paddingForIcon }) => ({
  flexDirection: 'row',
  top: paddingForIcon,
  alignItems: 'center',
}))

const StyledText = styled.Text<{
  typography?: string
  color?: ColorsType
}>(({ theme, typography, color }) => ({
  ...(typography === 'BodyAccentXs'
    ? theme.designSystem.typography.bodyAccentXs
    : theme.designSystem.typography.button),
  color: color ?? theme.designSystem.color.icon.brandPrimary,
}))
