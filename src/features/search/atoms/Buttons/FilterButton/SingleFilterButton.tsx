import React, { FunctionComponent } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Check } from 'ui/svg/icons/Check'
import { getSpacing, Typo } from 'ui/theme'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

type IsSelectedProps = {
  isSelected: boolean
}

export type SingleFilterButtonProps = IsSelectedProps & {
  label: string
  testID?: string
  onPress: () => void
  children?: never
}

export const SingleFilterButton: FunctionComponent<SingleFilterButtonProps> = ({
  label,
  isSelected,
  onPress,
  testID,
}) => {
  const filterButtonIcon = testID ? `${testID}Icon` : 'filterButtonIcon'
  const filterButtonLabel = testID ? `${testID}Label` : 'filterButtonLabel'

  return (
    <TouchableContainer isSelected={isSelected} onPress={onPress} testID={testID}>
      {!!isSelected && <StyledIcon testID={filterButtonIcon} />}
      <Label isSelected={isSelected} testID={filterButtonLabel}>
        {label}
      </Label>
    </TouchableContainer>
  )
}

const TouchableContainer = styledButton(Touchable)<IsSelectedProps>(({ theme, isSelected }) => ({
  boxSizing: 'border-box',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingLeft: getSpacing(4),
  paddingRight: getSpacing(4),
  paddingTop: getSpacing(1.5),
  paddingBottom: getSpacing(1.5),
  height: getSpacing(8),
  borderColor: isSelected ? theme.colors.primary : theme.colors.black,
  borderWidth: getSpacing(0.25),
  borderRadius: theme.borderRadius.button,
  ...(Platform.OS === 'web'
    ? {
        ['&:focus']: {
          outlineColor: theme.colors.accent,
        },
      }
    : {}),
  ...getHoverStyle(isSelected ? theme.colors.primary : theme.colors.black),
}))

const StyledIcon = styled(Check).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.colors.primary,
}))``

const Label = styled(Typo.Caption)<IsSelectedProps>(({ theme, isSelected }) => ({
  flex: 1,
  marginLeft: getSpacing(1),
  textAlign: 'left',
  color: isSelected ? theme.colors.primary : theme.colors.black,
}))
