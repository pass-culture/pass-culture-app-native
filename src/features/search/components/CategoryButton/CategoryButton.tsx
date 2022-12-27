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
    <TouchableContainer
      borderLeftColor={color}
      onPress={onPress}
      accessibilityLabel={`Catégorie ${label}`}>
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
    borderTopWidth: getSpacing(0.25),
    borderBottomWidth: getSpacing(0.25),
    borderRightWidth: getSpacing(0.25),
    borderLeftWidth: getSpacing(borderLeftColor ? 1 : 0.25),
    paddingLeft: getSpacing(theme.isMobileViewport ? 2 : 3),
    paddingRight: getSpacing(theme.isMobileViewport ? 2 : 3),
  })
)

const Label = styled(Typo.Caption)({
  flex: 1,
  marginLeft: getSpacing(2),
  textAlign: 'left',
})
