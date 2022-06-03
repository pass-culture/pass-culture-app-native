import React, { FunctionComponent, useMemo, useState } from 'react'
import { ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'

interface Props {
  label: string
  Icon: FunctionComponent<IconInterface>
  borderLeftColor: string
  style?: ViewStyle
}

export const CategoryButton: FunctionComponent<Props> = ({
  label,
  Icon,
  borderLeftColor,
  style,
}) => {
  const StyledIcon = useMemo(
    () =>
      styled(Icon).attrs(({ theme }) => ({
        size: theme.icons.sizes.small,
        color: theme.colors.black,
      }))({}),
    [Icon]
  )
  const [pressStatus, setPressStatus] = useState(false)

  const onPress = () => {
    setPressStatus(!pressStatus)
  }

  return (
    <TouchableContainer
      style={style}
      borderLeftColor={borderLeftColor}
      onPress={onPress}
      pressStatus={pressStatus}>
      <StyledIcon />
      <Label>{label}</Label>
    </TouchableContainer>
  )
}

const TouchableContainer = styled.TouchableOpacity<{
  borderLeftColor: string
  pressStatus: boolean
}>(({ theme, borderLeftColor, pressStatus }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  height: getSpacing(18),
  borderRadius: getSpacing(1),
  borderTopColor: !pressStatus ? theme.colors.greySemiDark : borderLeftColor,
  borderBottomColor: !pressStatus ? theme.colors.greySemiDark : borderLeftColor,
  borderRightColor: !pressStatus ? theme.colors.greySemiDark : borderLeftColor,
  borderLeftColor,
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderRightWidth: 1,
  borderLeftWidth: getSpacing(1),
  paddingLeft: getSpacing(2),
  paddingRight: getSpacing(3),
}))

const Label = styled(Typo.Caption)({ marginLeft: getSpacing(2) })
