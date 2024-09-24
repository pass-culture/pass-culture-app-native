import React, { FunctionComponent, useRef, useState } from 'react'
import { Alert } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import {
  Camera,
  useCameraPermission,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera'
import styled, { useTheme } from 'styled-components/native'

import { Touchable } from 'ui/components/touchable/Touchable'
import { ScanIllustration } from 'ui/svg/icons/ScanIllustration'
import { getSpacing, Typo } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

export const ScanButton: FunctionComponent = () => {
  const isScanned = useRef<boolean>(false)
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

  const theme = useTheme()
  const device = useCameraDevice('back')
  const { hasPermission, requestPermission } = useCameraPermission()
  const [showCamera, setShowCamera] = useState(false)

  const onPress = () => {
    if (!hasPermission) requestPermission()
    else setShowCamera(true)
  }
  console.log('showCamera :', showCamera)
  console.log('device: ', device)

  return (
    <React.Fragment>
      {device && showCamera ? (
        <Camera
          style={{ height: 400, width: '100%' }}
          device={device}
          isActive={showCamera}
          codeScanner={codeScanner}
        />
      ) : (
        <React.Fragment />
      )}
      <StyledTouchable onPress={onPress}>
        <StyledLinearGradient />
        <CardText>SCANNE LE RÉEL</CardText>
        <IllustrationContainer>
          <ScanIllustration size={getSpacing(18)} color={theme.colors.greyMedium} />
        </IllustrationContainer>
      </StyledTouchable>
    </React.Fragment>
  )
}
const StyledLinearGradient = styled(LinearGradient).attrs({
  useAngle: true,
  angle: 69,
  locations: [0.11, 0.68, 1],
  colors: ['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 1)'],
})(({ theme }) => ({
  height: '100%',
  width: '100%',
  borderRadius: theme.borderRadius.radius,
}))

const CardText = styled(Typo.ButtonText)({
  position: 'absolute',
  left: getSpacing(4),
  bottom: getSpacing(4),
})

const StyledTouchable = styled(Touchable)<{ isFocus?: boolean }>(({ theme, isFocus }) => ({
  overflow: 'hidden',
  borderRadius: theme.borderRadius.radius,
  borderColor: theme.colors.greyMedium,
  borderWidth: 1,
  width: '100%',
  height: getSpacing(20),
  ...customFocusOutline({ isFocus, color: theme.colors.black }),
  backgroundColor: theme.colors.lilac,
}))

const IllustrationContainer = styled.View({
  position: 'absolute',
  top: getSpacing(2.75),
  right: 0,
})
