import React, { useCallback, useMemo, useState } from 'react'
// eslint-disable-next-line no-restricted-imports
import { Image, useWindowDimensions } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import styled from 'styled-components/native'

import { calculateCarouselIndex } from 'features/offer/helpers/calculateCarouselIndex/calculateCarouselIndex'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { Carousel } from 'ui/components/Carousel/Carousel'
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

export const ImagesCarouselModal = ({
  imagesURL,
  hideModal,
  defaultIndex = 0,
  onClose,
  isVisible = false,
}: ImagesCarouselModalProps) => {
  const [carouselSize, setCarouselSize] = useState<CarouselSize>()
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()
  const [index, setIndex] = React.useState(defaultIndex)
  const progressValue = useSharedValue<number>(0)

  const getTitleLabel = useCallback(
    (progressValue: number) => `${Math.round(progressValue) + 1}/${imagesURL.length}`,
    [imagesURL]
  )

  const [title, setTitle] = useState(getTitleLabel(index))

  const CAROUSEL_ITEM_PADDING = getSpacing(16)

  const handleCloseModal = () => {
    hideModal()
    onClose?.()
  }

  const handlePressButton = useCallback(
    (direction: 1 | -1) => {
      const newIndex = calculateCarouselIndex({
        currentIndex: index,
        direction,
        maxIndex: imagesURL.length - 1,
      })
      setIndex(newIndex)
      setTitle(getTitleLabel(newIndex))
    },
    [imagesURL, index, setIndex, getTitleLabel]
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
          {carouselSize ? (
            <Carousel
              currentIndex={index}
              setIndex={setIndex}
              data={imagesURL}
              style={{ width: carouselSize.width }}
              width={carouselSize.width}
              scrollEnabled={false}
              progressValue={progressValue}
              renderItem={({ item: image, index }) => (
                <CarouselImage
                  source={{ uri: image }}
                  accessibilityLabel={`Image ${index + 1}`}
                  height={carouselSize.height}
                  width={carouselSize.width}
                />
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
    }

    return <CarouselImage source={{ uri: String(imagesURL[0]) }} accessibilityLabel="Image 1" />
  }, [carouselSize, imagesURL, handlePressButton, index, progressValue])

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
const CarouselImage = styled(Image).attrs({ resizeMode: 'contain' })<{
  height?: number
  width?: number
}>(({ height, width }) => ({
  width: width ?? '100%',
  height: height ?? '100%',
}))

const ModalBody = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
})
