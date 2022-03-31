import React from 'react'
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
      <TextContainer>
        <ButtonText isSelected={isSelected}>{text}</ButtonText>
        {!!description && <Caption>{description}</Caption>}
      </TextContainer>
      {!!isSelected && <Validate />}
    </StyledTouchableOpacity>
  )
}

const TextContainer = styled.View(({ theme }) => ({
  marginRight: theme.isMobileViewport ? 0 : getSpacing(6),
}))

const Validate = styled(DefaultValidate).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.small,
}))``

const StyledTouchableOpacity = styled(TouchableOpacity)(({ theme }) => ({
  minHeight: getSpacing(6),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: theme.isMobileViewport ? 'space-between' : 'start',
}))

const ButtonText = styled(Typo.ButtonText)<{ isSelected: boolean }>(({ isSelected, theme }) => ({
  color: isSelected ? theme.colors.primary : theme.colors.black,
}))

const Caption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
