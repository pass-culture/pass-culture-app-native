import React, { useCallback, useMemo, useState } from 'react'
// eslint-disable-next-line no-restricted-imports
import { Image, useWindowDimensions } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { calculateCarouselIndex } from 'features/offer/helpers/calculateCarouselIndex/calculateCarouselIndex'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { AppModal } from 'ui/components/modals/AppModal'
// eslint-disable-next-line no-restricted-imports
import { ModalSpacing } from 'ui/components/modals/enum'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing } from 'ui/theme'
import { Breakpoints } from 'ui/theme/grid'

const MODAL_MAX_WIDTH = Breakpoints.LG
const MODAL_PADDING = { x: getSpacing(10), y: getSpacing(10) }
const MODAL_HEADER_HEIGHT = getSpacing(7)

type CarouselSize = { width: number; height: number }

type ImagesCarouselModalProps = {
  imagesURL: string[]
  isVisible?: boolean
  hideModal: () => void
  onClose?: () => void
  defaultIndex?: number
}

const renderCarouselItem = ({ item: image, index }: { item: string; index: number }) => (
  <CarouselImage source={{ uri: image }} accessibilityLabel={`Image ${index + 1}`} />
)

export const ImagesCarouselModal = ({
  imagesURL,
  hideModal,
  defaultIndex = 0,
  onClose,
  isVisible = false,
}: ImagesCarouselModalProps) => {
  const [carouselSize, setCarouselSize] = useState<CarouselSize>()
  const progressValue = defaultIndex
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()
  const { isDesktopViewport } = useTheme()

  const getTitleLabel = useCallback(
    (progressValue: number) => `${Math.round(progressValue) + 1}/${imagesURL.length}`,
    [imagesURL]
  )

  const [title, setTitle] = useState(getTitleLabel(progressValue))

  const CAROUSEL_ITEM_PADDING = isDesktopViewport ? getSpacing(20) : getSpacing(12)

  const handleCloseModal = () => {
    hideModal()
    onClose?.()
  }

  const handlePressButton = useCallback(
    (direction: 1 | -1) => {
      const newIndex = calculateCarouselIndex({
        currentIndex: progressValue,
        direction,
        maxIndex: imagesURL.length - 1,
      })
      setTitle(getTitleLabel(newIndex))
    },
    [getTitleLabel, imagesURL, progressValue]
  )

  const displayModalBody = useCallback(() => {
    if (imagesURL.length === 0) {
      return null
    }

    if (imagesURL.length > 1) {
      return (
        <React.Fragment>
          <RoundedButton
            iconName="previous"
            onPress={() => handlePressButton(-1)}
            accessibilityLabel="Image précédente"
          />
          {carouselSize
            ? imagesURL.map((imageUrl, index) => renderCarouselItem({ item: imageUrl, index }))
            : null}
          <RoundedButton
            iconName="next"
            onPress={() => handlePressButton(1)}
            accessibilityLabel="Image suivante"
          />
        </React.Fragment>
      )
    }

    return <CarouselImage source={{ uri: String(imagesURL[0]) }} accessibilityLabel="Image 1" />
  }, [carouselSize, imagesURL, handlePressButton])

  const desktopConstraints = useMemo(
    () => ({
      maxWidth: Math.min(windowWidth, MODAL_MAX_WIDTH) - 2 * MODAL_PADDING.x,
      maxHeight: windowHeight - 2 * MODAL_PADDING.y,
    }),
    [windowWidth, windowHeight]
  )

  return (
    <AppModal
      title={imagesURL.length > 1 ? title : ''}
      visible={isVisible}
      isFullscreen
      rightIcon={Close}
      desktopConstraints={desktopConstraints}
      onLayout={({ nativeEvent }) => {
        setCarouselSize({
          width: nativeEvent.layout.width - CAROUSEL_ITEM_PADDING * 2,
          height:
            nativeEvent.layout.height - ModalSpacing.MD - ModalSpacing.LG - MODAL_HEADER_HEIGHT,
        })
      }}
      rightIconAccessibilityLabel="Fermer la fenêtre"
      onRightIconPress={handleCloseModal}
      scrollEnabled={false}>
      <ModalBody>{displayModalBody()}</ModalBody>
    </AppModal>
  )
}

/**
 * We use RN Image component because it renders better with resizeMode in web mode than FastImage
 */
const CarouselImage = styled(Image).attrs({ resizeMode: 'contain' })({
  width: '100%',
  height: '100%',
})

const ModalBody = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
})
