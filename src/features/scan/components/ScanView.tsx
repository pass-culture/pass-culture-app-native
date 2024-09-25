import React, { FC, useEffect, useRef, useState } from 'react'
// eslint-disable-next-line no-restricted-imports
import { Image, View } from 'react-native'
import {
  Camera,
  PhotoFile,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera'
import styled from 'styled-components/native'

import { getSearchStackConfig } from 'features/navigation/SearchStackNavigator/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { useScanSearch } from 'features/scan/hooks/useScanSearch'
import { ErrorBanner } from 'ui/components/banners/ErrorBanner'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { Spinner } from 'ui/components/Spinner'
import { Info } from 'ui/svg/icons/Info'
import { getSpacing } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export const ScanView: FC = () => {
  const { goBack } = useGoBack(...getSearchStackConfig('SearchLanding'))

  const isScanned = useRef<boolean>(false)
  const { hasPermission, requestPermission } = useCameraPermission()
  const [takenPhoto, setTakenPhoto] = useState<PhotoFile | undefined>(undefined)
  const { search, showErrorBanner } = useScanSearch()

  const { top, bottom } = useCustomSafeInsets()

  const device = useCameraDevice('back')
  const camera = useRef<Camera>(null)
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

  const onPress = async () => {
    if (!camera.current) return
    const photo = await camera.current.takePhoto()
    // show image taken and loading
    setTakenPhoto(photo)
    // send to API
    // navigate to search
  }
  return (
    <Container>
      {hasPermission && device ? (
        takenPhoto?.path ? (
          <React.Fragment>
            <StyledImage source={{ uri: `file://${takenPhoto.path}` }} />
            <SpinnerView headerHeight={0}>
              <Spinner testID="spinner" size={getSpacing(15)} />
            </SpinnerView>
          </React.Fragment>
        ) : (
          <StyledCamera device={device} isActive codeScanner={codeScanner} ref={camera} photo />
        )
      ) : (
        <BlankScreen />
      )}

      <Shadow top={top} bottom={bottom} />

      <ButtonContainer top={top}>
        <RoundedButton iconName="back" onPress={goBack} accessibilityLabel="Revenir en arrière" />
      </ButtonContainer>

      <BannerContainer bottom={bottom}>
        <ButtonPrimary wording="Take Photo" onPress={onPress} />
        {showErrorBanner ? (
          <ErrorBanner message="Code-barre non reconnu" />
        ) : (
          <InfoBanner
            message="Scanne le code-barre d’un livre pour le trouver simplement dans l’application&nbsp;!"
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

const StyledImage = styled(Image)`
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

const SpinnerView = styled(View).attrs<{ headerHeight: number }>({})<{
  headerHeight: number
}>(({ headerHeight }) => ({
  flex: 1,
  paddingTop: headerHeight,
  justifyContent: 'center',
}))
