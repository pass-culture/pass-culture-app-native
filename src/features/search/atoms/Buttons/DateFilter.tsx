import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Validate as DefaultValidate } from 'ui/svg/icons/Validate'
import { getSpacing, Typo } from 'ui/theme'

interface Props {
  isSelected: boolean
  onPress: () => void
  text: string
  description?: string
  testID?: string
}

export const DateFilter: React.FC<Props> = ({
  text,
  description,
  onPress,
  isSelected,
  testID,
}: Props) => {
  return (
    <StyledTouchableOpacity
      accessibilityRole="radio"
      accessibilityState={{ checked: isSelected }}
      onPress={onPress}
      testID={testID}>
      <View>
        <ButtonText isSelected={isSelected}>{text}</ButtonText>
        {!!description && <Caption>{description}</Caption>}
      </View>
      {!!isSelected && <Validate />}
    </StyledTouchableOpacity>
  )
}

const Validate = styled(DefaultValidate).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.small,
}))``

const StyledTouchableOpacity = styled(TouchableOpacity)({
  minHeight: getSpacing(6),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const ButtonText = styled(Typo.ButtonText)<{ isSelected: boolean }>(({ isSelected, theme }) => ({
  color: isSelected ? theme.colors.primary : theme.colors.black,
}))

const Caption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
