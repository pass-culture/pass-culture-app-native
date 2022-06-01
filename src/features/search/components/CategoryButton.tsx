import React, { FunctionComponent, useMemo } from 'react'
import { View, ViewStyle } from 'react-native'
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

  return (
    <TouchableContainer style={style}>
      <BorderLeft backgroundColor={borderLeftColor} />
      <Label>{label}</Label>
      <StyledIcon />
    </TouchableContainer>
  )
}

const TouchableContainer = styled.TouchableOpacity(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  height: getSpacing(18),
  borderRadius: getSpacing(1),
  borderTopColor: theme.colors.greySemiDark,
  borderBottomColor: theme.colors.greySemiDark,
  borderRightColor: theme.colors.greySemiDark,
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderRightWidth: 1,
  paddingRight: getSpacing(4),
}))

const Label = styled(Typo.Caption)({ marginLeft: getSpacing(3) })

const BorderLeft = styled(View)<{ backgroundColor: string }>(({ backgroundColor }) => ({
  height: getSpacing(18),
  width: getSpacing(1),
  backgroundColor,
  borderTopLeftRadius: getSpacing(0.75),
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  borderBottomLeftRadius: getSpacing(0.75),
}))
