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

export type SingleFilterButtonProps = {
  label: string
  Icon?: FunctionComponent<IconInterface>
  color?: ColorsEnum
  testID?: string
  onPress: () => void
  children?: never
}

export const SingleFilterButton: FunctionComponent<SingleFilterButtonProps> = ({
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
      color: color ?? theme.colors.black,
    }))({})
  }

  const filterButtonIcon = testID ? `${testID}Icon` : 'filterButtonIcon'
  const filterButtonLabel = testID ? `${testID}Label` : 'filterButtonLabel'

  return (
    <TouchableContainer color={color} onPress={onPress} testID={testID}>
      {!!StyledIcon && <StyledIcon testID={filterButtonIcon} />}
      <Label color={color} testID={filterButtonLabel}>
        {label}
      </Label>
    </TouchableContainer>
  )
}

const TouchableContainer = styledButton(Touchable)<{ color?: ColorsEnum }>(({ theme, color }) => ({
  boxSizing: 'border-box',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingLeft: getSpacing(4),
  paddingRight: getSpacing(4),
  paddingTop: getSpacing(1.5),
  paddingBottom: getSpacing(1.5),
  height: getSpacing(8),
  borderColor: color ?? theme.colors.black,
  borderWidth: getSpacing(0.25),
  borderRadius: theme.borderRadius.button,
  ...(Platform.OS === 'web'
    ? {
        ['&:focus']: {
          outlineColor: theme.colors.accent,
        },
      }
    : {}),
  ...getHoverStyle(color ?? theme.colors.black),
}))

const Label = styled(Typo.Caption)<{ color?: ColorsEnum }>(({ theme, color }) => ({
  flex: 1,
  marginLeft: getSpacing(1),
  textAlign: 'left',
  color: color ?? theme.colors.black,
}))
