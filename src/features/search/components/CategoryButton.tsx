import React, { FunctionComponent, useMemo } from 'react'
import { ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'

interface Props {
  label: string
  Icon: FunctionComponent<IconInterface>
  color: string
  style?: ViewStyle
  children?: never
}

export const CategoryButton: FunctionComponent<Props> = ({ label, Icon, color, style }) => {
  const StyledIcon = useMemo(
    () =>
      styled(Icon).attrs(({ theme }) => ({
        size: theme.icons.sizes.small,
        color: theme.colors.black,
      }))({}),
    [Icon]
  )

  return (
    <TouchableContainer style={style} borderLeftColor={color}>
      <StyledIcon />
      <Label>{label}</Label>
    </TouchableContainer>
  )
}

const TouchableContainer = styled.TouchableOpacity<{ borderLeftColor: string }>(
  ({ theme, borderLeftColor }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    height: getSpacing(18),
    borderRadius: getSpacing(1),
    borderTopColor: theme.colors.greySemiDark,
    borderBottomColor: theme.colors.greySemiDark,
    borderRightColor: theme.colors.greySemiDark,
    borderLeftColor,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: getSpacing(1),
    paddingLeft: getSpacing(2),
    paddingRight: getSpacing(3),
  })
)

const Label = styled(Typo.Caption)({ marginLeft: getSpacing(2) })
