import React, { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import styled from 'styled-components/native'

import {
  getLocationChoiceName,
  getLocationChoiceIcon,
} from 'features/search/components/locationChoice.utils'
import { LocationChoiceType } from 'features/search/locationChoice.types'
import { Validate } from 'ui/svg/icons/Validate'
import { getSpacing, Spacer, Typo, ColorsEnum } from 'ui/theme'

type Props = {
  type: LocationChoiceType
}

export const LocationChoice: React.FC<Props> = ({ type }) => {
  const [isSelected, setIsSelected] = useState<boolean>(false)
  return (
    <Container onPress={() => setIsSelected(!isSelected)}>
      <FirstPart>
        {getLocationChoiceIcon(type, isSelected)}
        <Spacer.Row numberOfSpaces={2} />
        <Typo.ButtonText color={isSelected ? ColorsEnum.PRIMARY : ColorsEnum.BLACK}>
          {getLocationChoiceName(type)}
        </Typo.ButtonText>
      </FirstPart>
      {isSelected && (
        <IconContainer>
          <Validate color={ColorsEnum.PRIMARY} />
        </IconContainer>
      )}
    </Container>
  )
}

const FirstPart = styled(View)({
  flexDirection: 'row',
  alignItems: 'center',
})

const Container = styled(TouchableOpacity)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginHorizontal: getSpacing(6),
})

const IconContainer = styled.View({
  paddingRight: getSpacing(10),
})
