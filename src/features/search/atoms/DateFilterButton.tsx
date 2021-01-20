import React, { useState } from 'react'
import styled from 'styled-components/native'

import { Validate } from 'ui/svg/icons/Validate'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

interface Props {
  text: string
}

export const DateFilterButton: React.FC<Props> = ({ text }: Props) => {
  const [isSelected, setIsSelected] = useState(false)

  const selectButton = () => setIsSelected(!isSelected)
  const color = isSelected ? ColorsEnum.PRIMARY : ColorsEnum.BLACK

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={6} />
      <ButtonContainer onPress={selectButton}>
        <Typo.ButtonText color={color}>{text}</Typo.ButtonText>
        {isSelected && <Validate color={ColorsEnum.PRIMARY} size={getSpacing(6)} />}
      </ButtonContainer>
      <Spacer.Column numberOfSpaces={isSelected ? 0 : 1} />
    </React.Fragment>
  )
}

const ButtonContainer = styled.TouchableOpacity({
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginHorizontal: getSpacing(6),
})
