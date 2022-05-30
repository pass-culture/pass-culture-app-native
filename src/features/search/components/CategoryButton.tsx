import React, { FunctionComponent, useMemo } from 'react'
import { ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'

interface Props {
  label: string
  Icon: FunctionComponent<IconInterface>
  style?: ViewStyle
}

export const CategoryButton: FunctionComponent<Props> = ({ label, Icon, style }) => {
  const StyledIcon = useMemo(
    () =>
      styled(Icon).attrs(({ theme }) => ({
        size: theme.icons.sizes.small,
        color: theme.colors.primary,
        color2: theme.colors.secondary,
      }))({}),
    [Icon]
  )

  return (
    <TouchableContainer style={style}>
      <StyledIcon />
      <Label>{label}</Label>
    </TouchableContainer>
  )
}

const TouchableContainer = styled.TouchableOpacity(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  height: getSpacing(18),
  borderRadius: theme.borderRadius.radius,
  borderColor: theme.colors.greySemiDark,
  borderWidth: 1,
  paddingLeft: getSpacing(3),
}))

const Label = styled(Typo.Caption)({ marginLeft: getSpacing(2) })
