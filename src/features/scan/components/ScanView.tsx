import React, { FC } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { TouchableOpacity } from 'ui/components/TouchableOpacity'

export const ScanView: FC = () => {
  return (
    <Container>
      <StyledCamera />
      <ButtonContainer>
        <StyledButton>
          <ButtonText>Scan Text</ButtonText>
        </StyledButton>
        <StyledButton>
          <ButtonText>Scan ISBN</ButtonText>
        </StyledButton>
      </ButtonContainer>
    </Container>
  )
}

const Container = styled.View`
  flex: 1;
  justify-content: flex-end;
`
// met ton composant caméra ici
// const StyledCamera = styled(RNCamera)`
const StyledCamera = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  position: absolute;
  bottom: 30px;
  width: 100%;
`

const StyledButton = styled(TouchableOpacity)`
  background-color: #fff;
  padding: 15px;
  border-radius: 5px;
`

const ButtonText = styled.Text`
  font-size: 18px;
  color: #000;
`
