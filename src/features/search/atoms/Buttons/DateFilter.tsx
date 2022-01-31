import React from 'react'
import styled from 'styled-components/native'

import { Validate } from 'ui/svg/icons/Validate'
import { getSpacing, Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
interface Props {
  isSelected: boolean
  onPress: () => void
  text: string
}

export const DateFilter: React.FC<Props> = ({ text, onPress, isSelected }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <ButtonText isSelected={isSelected}>{text}</ButtonText>
      {!!isSelected && <Validate color={ColorsEnum.PRIMARY} size={getSpacing(6)} />}
    </TouchableOpacity>
  )
}

const TouchableOpacity = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))({
  height: getSpacing(6),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const ButtonText = styled(Typo.ButtonText)<{ isSelected: boolean }>(({ isSelected, theme }) => ({
  color: isSelected ? theme.colors.primary : theme.colors.black,
}))
