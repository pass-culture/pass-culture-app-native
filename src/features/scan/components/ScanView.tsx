import React, { FC, useEffect, useRef, useState } from 'react'
import { Image } from 'react-native'
import {
  Camera,
  PhotoFile,
  useCameraDevice,
  useCameraPermission,
  useCameraFormat,
  useCodeScanner,
} from 'react-native-vision-camera'
import styled, { useTheme } from 'styled-components/native'

import { getSearchStackConfig } from 'features/navigation/SearchStackNavigator/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { useScanSearch } from 'features/scan/hooks/useScanSearch'
import { ErrorBanner } from 'ui/components/banners/ErrorBanner'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Tooltip } from 'ui/components/Tooltip'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Camera as CameraIcon } from 'ui/svg/icons/Camera'
import { ScanIllustration } from 'ui/svg/icons/ScanIllustration'
import { Spacer, Typo, getSpacing } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export const ScanView: FC = () => {
  const { goBack } = useGoBack(...getSearchStackConfig('SearchLanding'))
  const theme = useTheme()

  const [selectedButton, setSelectedButton] = useState<'barcode' | 'photo'>('barcode')
  const [isBarcodeTooltipVisible, setBarcodeTooltipVisible] = useState(true)
  const [isPhotoTooltipVisible, setPhotoTooltipVisible] = useState(true)
  const [takenPhoto, setTakenPhoto] = useState<PhotoFile | undefined>(undefined)

  const isScanned = useRef<boolean>(false)
  const { hasPermission, requestPermission } = useCameraPermission()
  const { search, showErrorBanner, searchByImage, isLoading } = useScanSearch()

  const { top, bottom } = useCustomSafeInsets()

  const device = useCameraDevice('back')
  const format = useCameraFormat(device, [{ photoResolution: 'max' }, { videoResolution: 'max' }])
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
    setTakenPhoto(photo)
    searchByImage(photo.path)
  }

  const handleBarcodeButtonClick = () => {
    setSelectedButton('barcode')
  }

  const handlePhotoButtonClick = () => {
    setSelectedButton('photo')
  }

  const pointerAlign = selectedButton === 'barcode' ? 'left' : 'right'

  return (
    <Container>
      {hasPermission && device && !isLoading ? (
        takenPhoto?.path ? (
          <StyledImage source={{ uri: `file://${takenPhoto.path}` }} />
        ) : (
          <StyledCamera
            device={device}
            isActive
            codeScanner={codeScanner}
            format={format}
            ref={camera}
            photo
          />
        )
      ) : (
        <BlankScreen />
      )}

      <HeaderShadow top={top} bottom={bottom} />

      <GoBackButtonContainer top={top}>
        <RoundedButton iconName="back" onPress={goBack} accessibilityLabel="Revenir en arrière" />
      </GoBackButtonContainer>

      {showErrorBanner ? (
        <ErrorBannerContainer bottom={bottom}>
          <ErrorBanner message="Code-barre non reconnu" />
        </ErrorBannerContainer>
      ) : null}

      {selectedButton === 'barcode' && isBarcodeTooltipVisible ? (
        <StyledTooltip
          bottom={bottom}
          label="Scanne le code-barre d’un livre pour le trouver simplement dans l’application"
          pointerDirection="bottom"
          pointerAlign={pointerAlign}
          isVisible={isBarcodeTooltipVisible}
          onCloseIconPress={() => setBarcodeTooltipVisible(false)}
        />
      ) : null}

      {selectedButton === 'photo' && isPhotoTooltipVisible ? (
        <StyledTooltip
          bottom={bottom}
          label="Prend une photo d’un article, d’une affiche ou d’un lieu culturel pour le trouver simplement dans l’application"
          pointerDirection="bottom"
          pointerAlign={pointerAlign}
          isVisible={isPhotoTooltipVisible}
          onCloseIconPress={() => setPhotoTooltipVisible(false)}
        />
      ) : null}

      <BottomContainer bottom={bottom}>
        <StyledTouchable
          onPress={handleBarcodeButtonClick}
          isSelected={selectedButton === 'barcode'}>
          <ScanIllustration size={getSpacing(10)} color={theme.colors.greyMedium} />
          <Spacer.Row numberOfSpaces={1} />
          <StyledButtonText>Code-barre</StyledButtonText>
        </StyledTouchable>

        <Spacer.Row numberOfSpaces={5} />

        <StyledTouchable onPress={handlePhotoButtonClick} isSelected={selectedButton === 'photo'}>
          <CameraIcon size={getSpacing(9)} color={theme.colors.greyMedium} />
          <Spacer.Row numberOfSpaces={1} />
          <StyledButtonText>Photo</StyledButtonText>
        </StyledTouchable>
      </BottomContainer>

      {selectedButton === 'photo' ? (
        <ButtonPhotoContainer bottom={bottom}>
          <ButtonPhoto onPress={onPress}>
            <InnerCircle />
          </ButtonPhoto>
        </ButtonPhotoContainer>
      ) : null}
    </Container>
  )
}

const StyledTooltip = styled(Tooltip)<{ bottom: number }>(({ bottom, theme }) => ({
  position: 'absolute',
  left: 0,
  zIndex: theme.zIndex.header,
  margin: theme.contentPage.marginHorizontal,
  bottom: bottom + getSpacing(15),
  maxWidth: '88%',
  minWidth: '88%',
}))

const ErrorBannerContainer = styled.View<{ bottom: number }>(({ bottom, theme }) => ({
  padding: theme.contentPage.marginHorizontal,
  position: 'absolute',
  width: '100%',
  bottom: bottom + getSpacing(25),
}))

const StyledButtonText = styled(Typo.ButtonText)(({ theme }) => ({
  color: theme.colors.white,
}))

const BottomContainer = styled.View<{ bottom: number }>(({ bottom, theme }) => ({
  position: 'absolute',
  bottom: 0,
  padding: theme.contentPage.marginHorizontal,
  paddingBottom: theme.contentPage.marginHorizontal + bottom,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  width: '100%',
  flexDirection: 'row',
}))

const StyledTouchable = styledButton(Touchable).attrs(({ theme }) => ({
  hoverUnderlineColor: theme.colors.primary,
}))<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  justifyContent: 'flex-start',
  alignItems: 'center',
  flexDirection: 'row',
  alignSelf: 'center',
  backgroundColor: isSelected ? 'rgba(50, 0, 150, 0.5)' : 'rgba(0, 0, 0, 0.5)',
  flex: 1,
  height: getSpacing(13),
  borderRadius: getSpacing(2),
  paddingHorizontal: getSpacing(1),
  borderWidth: 2,
  borderStyle: 'solid',
  borderColor: isSelected ? theme.colors.secondary : 'rgba(100, 100, 100, 0.75)',
}))

const Container = styled.View({
  flex: 1,
  justifyContent: 'flex-end',
  width: '100%',
})

const GoBackButtonContainer = styled.View<{ top: number }>(({ theme, top }) => ({
  flexDirection: 'row',
  position: 'absolute',
  top,
  left: theme.contentPage.marginHorizontal,
}))

const StyledCamera = styled(Camera)({
  position: 'absolute',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
})

const StyledImage = styled(Image)({
  position: 'absolute',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
})

const BlankScreen = styled.View({
  backgroundColor: 'black',
  position: 'absolute',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
})

const HeaderShadow = styled.View<{ top: number; bottom: number }>(({ top, bottom }) => ({
  top: 0,
  position: 'absolute',
  borderTopWidth: top + getSpacing(15),
  borderColor: 'rgba(0, 0, 0, 0.5)',
  width: '100%',
  height: '100%',
  justifyContent: 'space-between',
  bottom,
}))

const ButtonPhoto = styled.TouchableOpacity({
  width: '80px',
  height: '80px',
  borderRadius: '40px',
  backgroundColor: '#fff',
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: '5px',
  borderColor: '#d9d9d9',
})

const InnerCircle = styled.View({
  width: '60px',
  height: '60px',
  borderRadius: '30px',
  backgroundColor: '#fff',
  borderWidth: '1px',
  borderColor: '#f0f0f0',
})

const ButtonPhotoContainer = styled.View<{ bottom: number }>(({ bottom }) => ({
  position: 'absolute',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  bottom: bottom + getSpacing(27),
}))

// const SpinnerView = styled(View).attrs<{ headerHeight: number }>({})<{
//   headerHeight: number
// }>(({ headerHeight }) => ({
//   flex: 1,
//   paddingTop: headerHeight,
//   justifyContent: 'center',
// }))
