import React, { FC, useEffect, useRef } from 'react'
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera'
import styled from 'styled-components/native'
import { useScanSearch } from 'features/scan/hooks/useScanSearch'

import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { useGoBack } from 'features/navigation/useGoBack'
import { getSearchStackConfig } from 'features/navigation/SearchStackNavigator/helpers'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { getSpacing } from 'ui/theme'
import { ErrorBanner } from 'ui/components/banners/ErrorBanner'
import { Info } from 'ui/svg/icons/Info'

export const ScanView: FC = () => {
  const { goBack } = useGoBack(...getSearchStackConfig('SearchLanding'))

  const isScanned = useRef<boolean>(false)
  const { hasPermission, requestPermission } = useCameraPermission()
  const { search, showErrorBanner } = useScanSearch()

  const { top, bottom } = useCustomSafeInsets()

  const device = useCameraDevice('back')
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: async (codes) => {
      if (!isScanned.current) {
        isScanned.current = true
        const scannedCode = codes[0]?.value

        if (scannedCode) {
          await search(scannedCode)
          isScanned.current = false
        }
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

      <Shadow top={top} bottom={bottom} />

      <ButtonContainer top={top}>
        <RoundedButton iconName="back" onPress={goBack} accessibilityLabel="Revenir en arrière" />
      </ButtonContainer>

      <BannerContainer bottom={bottom}>
        {showErrorBanner ? (
          <ErrorBanner message="Code-barre non reconnu" />
        ) : (
          <InfoBanner
            message="Scanne le code-barre d'un livre pour le trouver simplement dans l'application !"
            icon={Info}
          />
        )}
      </BannerContainer>
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
  justifyContent: 'flex-end',
})

const ButtonContainer = styled.View<{ top: number }>(({ theme, top }) => ({
  flexDirection: 'row',
  position: 'absolute',
  top,
  left: theme.contentPage.marginHorizontal,
  width: '100%',
}))

const BannerContainer = styled.View<{ bottom: number }>(({ bottom }) => ({
  position: 'absolute',
  bottom: bottom + getSpacing(8),
  left: '7.5%',
  width: '85%',
}))

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

const Shadow = styled.View<{ top: number; bottom: number }>(({ theme, top, bottom }) => ({
  top: 0,
  position: 'absolute',
  borderTopWidth: top + getSpacing(15),
  borderBottomWidth: bottom + getSpacing(30),
  borderColor: 'rgba(0, 0, 0, 0.5)',
  width: '100%',
  height: '100%',
}))
