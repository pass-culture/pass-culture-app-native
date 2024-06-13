import React, { FunctionComponent, useState } from 'react'
import { Platform, useWindowDimensions } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import {
  EnrichedVideoCarouselItem,
  RedirectionMode,
  useVideoCarouselData,
} from 'features/home/api/useVideoCarouselData'
import { AttachedOfferCard } from 'features/home/components/AttachedOfferCard'
import { videoSourceExtractor } from 'features/home/components/helpers/videoSourceExtractor'
import { newColorMapping } from 'features/home/components/modules/categories/CategoryBlock'
import { VerticalVideoPlayer } from 'features/home/components/modules/video/VerticalVideoPlayer'
import { Color, VideoCarouselModule as VideoCarouselModuleType } from 'features/home/types'
import { useHasGraphicRedesign } from 'libs/contentful/useHasGraphicRedesign'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { formatDates } from 'libs/parsers/formatDates'
import { getDisplayPrice } from 'libs/parsers/getDisplayPrice'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { CarouselBar } from 'ui/CarouselBar/CarouselBar'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getSpacing } from 'ui/theme'

const CAROUSEL_HEIGHT = getSpacing(35)
const CAROUSEL_ANIMATION_DURATION = 500

interface VideoCarouselModuleBaseProps extends VideoCarouselModuleType {
  index: number
  homeEntryId: string
  autoplay?: boolean
}

export const VideoCarouselModule: FunctionComponent<VideoCarouselModuleBaseProps> = (props) => {
  const prePopulateOffer = usePrePopulateOffer()
  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()

  const { width: windowWidth } = useWindowDimensions()
  const carouselRef = React.useRef<ICarouselInstance>(null)
  const progressValue = useSharedValue<number>(0)
  const carouselDotId = uuidv4()

  const enableVideoCarousel = useFeatureFlag('WIP_APP_V2_VIDEO_9_16')
  const hasGraphicRedesign = useHasGraphicRedesign({
    isFeatureFlagActive: enableVideoCarousel,
    homeId: props.homeEntryId,
  })
  const shouldModuleBeDisplayed = Platform.OS !== 'web'

  const { items, color, id, autoplay } = props
  const itemsWithRelatedData = useVideoCarouselData(items, id)

  const hasItems = itemsWithRelatedData.length > 0
  const videoSources = videoSourceExtractor(itemsWithRelatedData)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoplay ? true : false)
  const [hasFinishedPlaying, setHasFinishedPlaying] = useState(false)

  const playNextVideo = () => {
    let nextIndex
    if (currentIndex + 1 < itemsWithRelatedData.length) {
      nextIndex = currentIndex + 1
      carouselRef.current?.next()
    } else {
      nextIndex = 0
      carouselRef.current?.scrollTo({ index: nextIndex })
    }
    setCurrentIndex(nextIndex)
    setIsPlaying(true)
    setHasFinishedPlaying(false)
  }

  if (!shouldModuleBeDisplayed || !hasItems || !hasGraphicRedesign) return null

  const renderItem = ({ item, index }: { item: EnrichedVideoCarouselItem; index: number }) => {
    if (item.redirectionMode === RedirectionMode.OFFER && item.offer) {
      const { offer } = item

      const categoryId = mapping[offer.offer.subcategoryId]
      const categoryText = labelMapping[offer.offer.subcategoryId] ?? ''
      const timestampsInMillis = offer
        ? offer.offer.dates?.map((timestampInSec) => timestampInSec * 1000)
        : undefined
      const displayDate = formatDates(timestampsInMillis)

      const displayPrice = getDisplayPrice(offer?.offer?.prices)

      const containerProps = offer
        ? {
            navigateTo: {
              screen: 'Offer',
              params: { id: +offer.objectID },
            },
            onBeforeNavigate: () => {
              prePopulateOffer({
                ...offer.offer,
                offerId: +offer.objectID,
                categoryId,
              })
            },
          }
        : undefined

      return (
        <StyledInternalTouchableLink key={index} {...containerProps}>
          <AttachedOfferCard
            title={offer.offer.name ?? ''}
            categoryId={categoryId}
            categoryText={categoryText}
            imageUrl={offer.offer.thumbUrl}
            showImage
            withRightArrow
            offerLocation={offer._geoloc}
            date={displayDate}
            price={displayPrice}
          />
        </StyledInternalTouchableLink>
      )
    }
    const { homeEntryId, thematicHomeSubtitle, thematicHomeTag, thematicHomeTitle } = item

    const containerProps = {
      navigateTo: {
        screen: 'ThematicHome',
        params: {
          homeId: homeEntryId,
          from: 'video_carousel_block',
          moduleId: id,
        },
      },
    }

    return (
      <StyledInternalTouchableLink key={index} {...containerProps}>
        <AttachedOfferCard
          title={thematicHomeTitle ?? ''}
          categoryId={null}
          categoryText={thematicHomeTag ?? ''}
          showImage={false}
          date={thematicHomeSubtitle ?? ''}
          withRightArrow
          fixedHeight
        />
      </StyledInternalTouchableLink>
    )
  }

  const SingleAttachedItem = () => {
    if (itemsWithRelatedData[0])
      return (
        <SingleItemContainer>
          {renderItem({ item: itemsWithRelatedData[0], index: 1 })}
        </SingleItemContainer>
      )
    return null
  }

  return (
    <Container>
      <VerticalVideoPlayer
        videoSources={videoSources}
        playNextVideo={playNextVideo}
        currentIndex={currentIndex}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        hasFinishedPlaying={hasFinishedPlaying}
        setHasFinishedPlaying={setHasFinishedPlaying}
      />
      <ColoredAttachedTileContainer color={color}>
        {itemsWithRelatedData.length > 1 ? (
          <React.Fragment>
            <Carousel
              ref={carouselRef}
              mode="parallax"
              testID="videoCarousel"
              vertical={false}
              height={CAROUSEL_HEIGHT}
              panGestureHandlerProps={{ activeOffsetX: [-5, 5] }}
              width={windowWidth}
              loop={false}
              scrollAnimationDuration={CAROUSEL_ANIMATION_DURATION}
              onProgressChange={(_, absoluteProgress) => {
                progressValue.value = absoluteProgress
                setCurrentIndex(Math.round(absoluteProgress))
              }}
              data={itemsWithRelatedData}
              renderItem={renderItem}
            />
            <DotContainer>
              {itemsWithRelatedData.map((_, index) => (
                <CarouselBar animValue={progressValue} index={index} key={index + carouselDotId} />
              ))}
            </DotContainer>
          </React.Fragment>
        ) : (
          <SingleAttachedItem />
        )}
      </ColoredAttachedTileContainer>
    </Container>
  )
}

const Container = styled.View({
  marginBottom: getSpacing(6),
})

const ColoredAttachedTileContainer = styled.View<{
  color: Color
}>(({ color }) => ({
  backgroundColor: newColorMapping[color].fill,
}))

const StyledInternalTouchableLink = styled(InternalTouchableLink)({
  paddingHorizontal: getSpacing(1),
})

const SingleItemContainer = styled.View({
  marginHorizontal: getSpacing(5),
  marginVertical: getSpacing(4),
})

const DotContainer = styled.View({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  flexDirection: 'row',
  justifyContent: 'center',
  paddingBottom: getSpacing(1),
})
