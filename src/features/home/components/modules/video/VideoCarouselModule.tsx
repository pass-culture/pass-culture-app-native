import React, { FunctionComponent, useState } from 'react'
import { Platform, useWindowDimensions } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { CategoryIdEnum } from 'api/gen'
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
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { formatDates } from 'libs/parsers/formatDates'
import { getDisplayPrice } from 'libs/parsers/getDisplayPrice'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { CarouselBar } from 'ui/CarouselBar/CarouselBar'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getSpacing } from 'ui/theme'

const CAROUSEL_HEIGHT = getSpacing(45)
const CAROUSEL_ANIMATION_DURATION = 500

interface VideoCarouselModuleBaseProps extends VideoCarouselModuleType {
  index: number
  homeEntryId: string
}

export const VideoCarouselModule: FunctionComponent<VideoCarouselModuleBaseProps> = (props) => {
  const prePopulateOffer = usePrePopulateOffer()
  const { width } = useWindowDimensions()
  const carouselRef = React.useRef<ICarouselInstance>(null)
  const progressValue = useSharedValue<number>(0)
  const carouselDotId = uuidv4()

  const enableVideoCarousel = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_VIDEO_9_16)
  const shouldModuleBeDisplayed = Platform.OS !== 'web'

  const { homeEntryId, items, color, id } = props
  const itemsWithRelatedData = useVideoCarouselData(items, homeEntryId)

  const hasItems = itemsWithRelatedData.length > 0
  const videoSources = videoSourceExtractor(itemsWithRelatedData)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [hasFinishedPlaying, setHasFinishedPlaying] = useState(false)

  const playNextVideo = () => {
    let nextIndex
    if (currentIndex + 1 < itemsWithRelatedData.length) {
      nextIndex = currentIndex + 1
      carouselRef.current?.next()
    } else {
      nextIndex = 0
      carouselRef.current?.scrollTo({ index: 0 })
    }
    setCurrentIndex(nextIndex)
    setIsPlaying(true)
    setHasFinishedPlaying(false)
  }

  if (!shouldModuleBeDisplayed || !hasItems || !enableVideoCarousel) return null

  const renderItem = ({ item, index }: { item: EnrichedVideoCarouselItem; index: number }) => {
    if (item.redirectionMode === RedirectionMode.OFFER && item.offer) {
      const { offer } = item

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
                categoryId: CategoryIdEnum.CARTE_JEUNES,
              })
            },
          }
        : undefined

      return (
        <StyledInternalTouchableLink key={index} {...containerProps}>
          <AttachedOfferCard
            title={offer.offer.name ?? ''}
            categoryId={CategoryIdEnum.CARTE_JEUNES}
            categoryText=""
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
    const { homeEntryId } = item

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
          title="Le meilleur du cinéma en juin pour un été de folie"
          categoryId={null}
          categoryText="Lecture"
          showImage={false}
          date="Du 16/05 au 14/08"
          withRightArrow
          fixedHeight
        />
      </StyledInternalTouchableLink>
    )
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
        <Carousel
          ref={carouselRef}
          testID="videoCarousel"
          vertical={false}
          height={CAROUSEL_HEIGHT}
          width={width}
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
  marginHorizontal: getSpacing(4),
  marginVertical: getSpacing(4),
})

const DotContainer = styled.View({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  flexDirection: 'row',
  justifyContent: 'center',
  paddingBottom: getSpacing(2),
})
