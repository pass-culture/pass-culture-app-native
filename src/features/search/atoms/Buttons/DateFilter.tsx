import React from 'react'
import styled from 'styled-components/native'

import { Validate as ValidateDefault } from 'ui/svg/icons/Validate'
import { getSpacing, Typo } from 'ui/theme'

interface Props {
  isSelected: boolean
  onPress: () => void
  text: string
}

export const DateFilter: React.FC<Props> = ({ text, onPress, isSelected }: Props) => {
  return (
    <ButtonContainer onPress={onPress}>
      <ButtonText isSelected={isSelected}>{text}</ButtonText>
      {!!isSelected && <Validate />}
    </ButtonContainer>
  )
}

const ButtonText = styled(Typo.ButtonText)<{ isSelected: boolean }>(({ isSelected, theme }) => ({
  color: isSelected ? theme.colors.primary : theme.colors.black,
}))

const Validate = styled(ValidateDefault).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icon.smSize,
}))``

const ButtonContainer = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))({
  height: getSpacing(6),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
})
