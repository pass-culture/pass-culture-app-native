import React from 'react'
import styled from 'styled-components/native'

import { Validate } from 'ui/svg/icons/Validate'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

interface Props {
  isSelected: boolean
  onPress: () => void
  text: string
}

export const DateFilter: React.FC<Props> = ({ text, onPress, isSelected }: Props) => {
  const color = isSelected ? ColorsEnum.PRIMARY : ColorsEnum.BLACK

  return (
    <ButtonContainer onPress={onPress}>
      <Typo.ButtonText color={color}>{text}</Typo.ButtonText>
      {isSelected && <Validate color={ColorsEnum.PRIMARY} size={getSpacing(8)} />}
    </ButtonContainer>
  )
}

const ButtonContainer = styled.TouchableOpacity({
  height: getSpacing(6),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
})
