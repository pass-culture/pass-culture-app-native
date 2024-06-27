import React, { useRef, useState } from 'react'
import { useSharedValue } from 'react-native-reanimated'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
import styled from 'styled-components/native'

import { calculateCarouselIndex } from 'features/offer/helpers/calculateCarouselIndex/calculateCarouselIndex'
import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing } from 'ui/theme'

const CAROUSEL_ITEM_PADDING = getSpacing(12)

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
  const [carouselSize, setCarouselSize] = useState({ width: 100, height: 100 })
  const carouselRef = useRef<ICarouselInstance>(null)
  const progressValue = useSharedValue<number>(0)

  const getTitleLabel = (progressValue: number) =>
    `${Math.round(progressValue) + 1}/${offerImages.length}`

  const [title, setTitle] = useState(getTitleLabel(progressValue.value))

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
        renderItem={({ item: image }) => (
          <CarouselItemContainer>
            <FullHeightImage url={image} />
          </CarouselItemContainer>
        )}
      />

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
    return <FullHeightImage url={String(offerImages[0])} />
  }

  return (
    <AppModal
      title={offerImages.length > 1 ? title : ''}
      visible={isVisible}
      isFullscreen
      rightIcon={Close}
      onLayout={({ nativeEvent }) => {
        setCarouselSize({
          width: nativeEvent.layout.width - CAROUSEL_ITEM_PADDING * 2,
          height: nativeEvent.layout.height - CAROUSEL_ITEM_PADDING * 2,
        })
      }}
      rightIconAccessibilityLabel="Fermer la fenêtre"
      onRightIconPress={handleCloseModal}
      scrollEnabled={false}>
      <ModalBody>{displayModalBody()}</ModalBody>
    </AppModal>
  )
}

const CarouselItemContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
})

const FullHeightImage = styled(FastImage)({
  height: '100%',
})

const ModalBody = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
})
