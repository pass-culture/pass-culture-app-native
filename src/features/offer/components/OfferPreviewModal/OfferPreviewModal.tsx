import React, { useMemo, useRef, useState } from 'react'
// eslint-disable-next-line no-restricted-imports
import { Image, useWindowDimensions } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
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

type OfferPreviewModalProps = {
  offerImages: string[]
  isVisible?: boolean
  hideModal: () => void
  onClose?: () => void
  defaultIndex?: number
}

export const OfferPreviewModal = ({
  offerImages,
  hideModal,
  defaultIndex = 0,
  onClose,
  isVisible = false,
}: OfferPreviewModalProps) => {
  const [carouselSize, setCarouselSize] = useState<{ width: number; height: number }>()
  const carouselRef = useRef<ICarouselInstance>(null)
  const progressValue = useSharedValue<number>(0)
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()
  const { isDesktopViewport } = useTheme()

  const getTitleLabel = (progressValue: number) =>
    `${Math.round(progressValue) + 1}/${offerImages.length}`

  const [title, setTitle] = useState(getTitleLabel(progressValue.value))

  const CAROUSEL_ITEM_PADDING = isDesktopViewport ? getSpacing(20) : getSpacing(12)

  const handleCloseModal = () => {
    hideModal()
    onClose?.()
  }

  const handlePressButton = (direction: 1 | -1) => {
    const newIndex = calculateCarouselIndex({
      currentIndex: progressValue.value,
      direction,
      maxIndex: offerImages.length - 1,
    })
    progressValue.value = newIndex
    carouselRef.current?.scrollTo({ index: newIndex, animated: true })
  }

  const displayCarousel = () => (
    <React.Fragment>
      <RoundedButton
        iconName="previous"
        onPress={() => handlePressButton(-1)}
        accessibilityLabel="Image précédente"
      />

      {carouselSize ? (
        <Carousel
          ref={carouselRef}
          testID="offerImageContainerCarousel"
          vertical={false}
          width={carouselSize.width}
          height={carouselSize.height}
          loop={false}
          defaultIndex={defaultIndex}
          enabled={false}
          scrollAnimationDuration={500}
          onProgressChange={(_, absoluteProgress) => {
            progressValue.value = absoluteProgress
            setTitle(getTitleLabel(absoluteProgress))
          }}
          data={offerImages}
          renderItem={({ item: image, index }) => (
            <CarouselImage source={{ uri: image }} accessibilityLabel={`Image ${index + 1}`} />
          )}
        />
      ) : null}

      <RoundedButton
        iconName="next"
        onPress={() => handlePressButton(1)}
        accessibilityLabel="Image suivante"
      />
    </React.Fragment>
  )

  const displayModalBody = () => {
    if (offerImages.length === 0) {
      return null
    }

    if (offerImages.length > 1) {
      return displayCarousel()
    }
    return <CarouselImage source={{ uri: String(offerImages[0]) }} accessibilityLabel="Image 1" />
  }

  const desktopConstraints = useMemo(
    () => ({
      maxWidth: Math.min(windowWidth, MODAL_MAX_WIDTH) - 2 * MODAL_PADDING.x,
      maxHeight: windowHeight - 2 * MODAL_PADDING.y,
    }),
    [windowWidth, windowHeight]
  )

  return (
    <AppModal
      title={offerImages.length > 1 ? title : ''}
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
