import React from 'react'
import styled from 'styled-components/native'

import { Validate } from 'ui/svg/icons/Validate'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

interface Props {
  isSelected: boolean
  onPress: () => void
  text: string
}

export const DateFilter: React.FC<Props> = ({ text, onPress, isSelected }: Props) => {
  const color = isSelected ? ColorsEnum.PRIMARY : ColorsEnum.BLACK

  return (
    <ButtonContainer onPress={onPress} activeOpacity={ACTIVE_OPACITY}>
      <Typo.ButtonText color={color}>{text}</Typo.ButtonText>
      {!!isSelected && <Validate color={ColorsEnum.PRIMARY} size={getSpacing(6)} />}
    </ButtonContainer>
  )
}

const ButtonContainer = styled.TouchableOpacity({
  height: getSpacing(6),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
})
