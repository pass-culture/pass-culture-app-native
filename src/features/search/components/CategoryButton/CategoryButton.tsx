import React, { FunctionComponent, useMemo } from 'react'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'

export type CategoryButtonProps = {
  label: string
  Icon: FunctionComponent<IconInterface>
  color?: string
  onPress: () => void
  children?: never
}

export const CategoryButton: FunctionComponent<CategoryButtonProps> = ({
  label,
  Icon,
  color,
  onPress,
}) => {
  const StyledIcon = useMemo(
    () =>
      styled(Icon).attrs(({ theme }) => ({
        size: theme.icons.sizes.small,
        color: color ? theme.colors.black : theme.colors.primary,
        color2: color ? undefined : theme.colors.secondary,
      }))({}),
    [Icon, color]
  )

  return (
    <TouchableContainer borderLeftColor={color} onPress={onPress}>
      <StyledIcon />
      <Label>{label}</Label>
    </TouchableContainer>
  )
}

const TouchableContainer = styledButton(Touchable)<{ borderLeftColor?: string }>(
  ({ theme, borderLeftColor }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    height: getSpacing(18),
    borderRadius: getSpacing(1),
    borderTopColor: theme.colors.greySemiDark,
    borderBottomColor: theme.colors.greySemiDark,
    borderRightColor: theme.colors.greySemiDark,
    borderLeftColor: borderLeftColor ?? theme.colors.greySemiDark,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: borderLeftColor ? getSpacing(1) : 1,
    paddingLeft: getSpacing(2),
    paddingRight: getSpacing(3),
  })
)

const Label = styled(Typo.Caption)({
  marginLeft: getSpacing(2),
})
