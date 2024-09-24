import React, { FC, useEffect, useRef } from 'react'
import { Alert } from 'react-native'
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera'
import styled from 'styled-components/native'

import { TouchableOpacity } from 'ui/components/TouchableOpacity'

export const ScanView: FC = () => {
  const isScanned = useRef<boolean>(false)
  const { hasPermission, requestPermission } = useCameraPermission()

  const device = useCameraDevice('back')
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      if (!isScanned.current) {
        isScanned.current = true
        Alert.alert(`Scanned ${codes.length} codes!`, `${codes[0]?.value}`, [
          {
            text: 'Fermer',
            onPress: () => {
              isScanned.current = false
            },
          },
        ])
      }
    },
  })

  useEffect(() => {
    if (!hasPermission) {
      requestPermission()
    }
  }, [hasPermission, requestPermission])

  return (
    <Container>
      {hasPermission && device ? (
        <StyledCamera device={device} isActive codeScanner={codeScanner} />
      ) : (
        <BlankScreen />
      )}
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

const StyledCamera = styled(Camera)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const BlankScreen = styled.View`
  background-color: black;
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
