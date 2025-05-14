import React, { FunctionComponent, useEffect, useState } from 'react'
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
import { AttachedOfferCard } from 'features/home/components/AttachedModuleCard/AttachedOfferCard'
import { AttachedThematicCard } from 'features/home/components/AttachedModuleCard/AttachedThematicCard'
import { videoSourceExtractor } from 'features/home/components/helpers/videoSourceExtractor'
import { VerticalVideoPlayer } from 'features/home/components/modules/video/VerticalVideoPlayer'
import { Color, VideoCarouselModule as VideoCarouselModuleType } from 'features/home/types'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { analytics } from 'libs/analytics/provider'
import { ContentTypes } from 'libs/contentful/types'
import { useCategoryIdMapping } from 'libs/subcategories'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { CarouselBar } from 'ui/components/CarouselBar/CarouselBar'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getShadow, getSpacing } from 'ui/theme'
import { colorMapping } from 'ui/theme/colorMapping'

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

  const { width: windowWidth } = useWindowDimensions()
  const carouselRef = React.useRef<ICarouselInstance>(null)
  const progressValue = useSharedValue<number>(0)
  const carouselDotId = uuidv4()

  const { homeEntryId, items, color, id, autoplay, index } = props
  const itemsWithRelatedData = useVideoCarouselData(items, id)

  const hasItems = itemsWithRelatedData.length > 0
  const videoSources = videoSourceExtractor(itemsWithRelatedData)

  const shouldModuleBeDisplayed = Platform.OS !== 'web' && hasItems

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoplay ? true : false)
  const [hasFinishedPlaying, setHasFinishedPlaying] = useState(false)

  useEffect(() => {
    if (shouldModuleBeDisplayed) {
      analytics.logModuleDisplayedOnHomepage({
        moduleId: id,
        moduleType: ContentTypes.VIDEO_CAROUSEL,
        index,
        homeEntryId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldModuleBeDisplayed])

  useEffect(() => {
    if (shouldModuleBeDisplayed) {
      analytics.logConsultVideo({
        from: 'video_carousel_block',
        moduleId: id,
        homeEntryId,
        youtubeId: videoSources[currentIndex],
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, shouldModuleBeDisplayed])

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

  if (!shouldModuleBeDisplayed) return null

  const renderItem = ({ item, index }: { item: EnrichedVideoCarouselItem; index: number }) => {
    if (item.redirectionMode === RedirectionMode.OFFER && item.offer) {
      const { offer } = item

      const categoryId = mapping[offer.offer.subcategoryId]

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
              triggerConsultOfferLog({
                offerId: +offer.objectID,
                moduleId: item.id,
                from: 'video_carousel_block',
                homeEntryId,
              })
            },
          }
        : undefined

      return (
        <StyledInternalTouchableLink key={index} color={color} {...containerProps}>
          <AttachedOfferCard offer={offer} shouldFixHeight />
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
          moduleItemId: item.id,
        },
      },
    }

    return (
      <StyledInternalTouchableLink key={index} color={color} {...containerProps}>
        <AttachedThematicCard
          title={thematicHomeTitle ?? ''}
          subtitle={thematicHomeSubtitle}
          label={thematicHomeTag}
          shouldFixHeight
        />
      </StyledInternalTouchableLink>
    )
  }

  const SingleItemWithRelatedData = itemsWithRelatedData[0] ? (
    <SingleItemContainer>
      {renderItem({ item: itemsWithRelatedData[0], index: 1 })}
    </SingleItemContainer>
  ) : null

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
        moduleId={id}
        homeEntryId={homeEntryId}
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
              onConfigurePanGesture={(gesture) => {
                'worklet'
                gesture.activeOffsetX([-5, 5])
              }}
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
          SingleItemWithRelatedData
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
}>(({ theme, color }) => ({
  backgroundColor:
    theme.designSystem.color.background[colorMapping[color].fill ?? 'default'] ||
    colorMapping[color].fill,
}))

const StyledInternalTouchableLink = styled(InternalTouchableLink)<{
  color: Color
}>(({ theme, color }) => ({
  backgroundColor:
    theme.designSystem.color.background[colorMapping[color].fill ?? 'default'] ||
    colorMapping[color].fill,
  borderRadius: getSpacing(3),
  marginHorizontal: getSpacing(1),
  ...getShadow({
    shadowOffset: {
      width: 0,
      height: getSpacing(3),
    },
    shadowRadius: getSpacing(12),
    shadowColor: theme.colors.black,
    shadowOpacity: 0.15,
  }),
}))

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
