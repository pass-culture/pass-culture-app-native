import React, { FunctionComponent } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

export type SearchFilterButtonProps = {
  label: string
  Icon?: FunctionComponent<IconInterface>
  color?: ColorsEnum
  testID?: string
  onPress: () => void
  children?: never
}

export const SearchFilterButton: FunctionComponent<SearchFilterButtonProps> = ({
  label,
  Icon,
  color,
  onPress,
  testID,
}) => {
  let StyledIcon

  if (Icon) {
    StyledIcon = styled(Icon).attrs(({ theme }) => ({
      size: theme.icons.sizes.extraSmall,
      color: color ? color : theme.colors.black,
    }))({})
  }

  return (
    <TouchableContainer color={color} onPress={onPress} testID={testID}>
      {!!StyledIcon && <StyledIcon />}
      <Label color={color}>{label}</Label>
    </TouchableContainer>
  )
}

const TouchableContainer = styledButton(Touchable)<{ color?: ColorsEnum }>(({ theme, color }) => ({
  boxSizing: 'border-box',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '6px 16px',
  height: getSpacing(8),
  borderColor: color ? color : theme.colors.black,
  borderWidth: '1px',
  borderRadius: theme.borderRadius.button,
  ...(Platform.OS === 'web'
    ? {
        ['&:focus']: {
          outlineColor: theme.colors.accent,
        },
      }
    : {}),
  ...getHoverStyle(color ? color : theme.colors.black),
}))

const Label = styled(Typo.Caption)<{ color?: ColorsEnum }>(({ theme, color }) => ({
  flex: 1,
  marginLeft: getSpacing(1),
  textAlign: 'left',
  color: color ? color : theme.colors.black,
}))
