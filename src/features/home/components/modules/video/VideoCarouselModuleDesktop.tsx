import React, { FunctionComponent, useEffect, useState } from 'react'
import { View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { ICarouselInstance } from 'react-native-reanimated-carousel'
import styled from 'styled-components/native'

import {
  EnrichedVideoCarouselItem,
  RedirectionMode,
  useVideoCarouselData,
} from 'features/home/api/useVideoCarouselData'
import { AttachedOfferCard } from 'features/home/components/AttachedOfferCard'
import { videoSourceExtractor } from 'features/home/components/helpers/videoSourceExtractor'
import { newColorMapping } from 'features/home/components/modules/categories/CategoryBlock'
import { VerticalVideoPlayer } from 'features/home/components/modules/video/VerticalVideoPlayer.web'
import { Color, VideoCarouselModuleBaseProps } from 'features/home/types'
import { analytics } from 'libs/analytics'
import { ContentTypes } from 'libs/contentful/types'
import { useHasGraphicRedesign } from 'libs/contentful/useHasGraphicRedesign'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { formatDates } from 'libs/parsers/formatDates'
import { getDisplayPrice } from 'libs/parsers/getDisplayPrice'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { CarouselBar } from 'ui/CarouselBar/CarouselBar'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { PlaylistArrowButton } from 'ui/Playlist/PlaylistArrowButton'
import { getSpacing } from 'ui/theme'

const COLORED_BACKGROUND_HEIGHT = getSpacing(115)
const ATTACHED_CARD_WIDTH = getSpacing(94.25)

export const VideoCarouselModuleDesktop: FunctionComponent<VideoCarouselModuleBaseProps> = (
  props
) => {
  const prePopulateOffer = usePrePopulateOffer()
  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()

  const carouselRef = React.useRef<ICarouselInstance>(null)
  const progressValue = useSharedValue<number>(0)

  const enableVideoCarousel = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_VIDEO_710_WEB)
  const hasGraphicRedesign = useHasGraphicRedesign({
    isFeatureFlagActive: enableVideoCarousel,
    homeId: props.homeEntryId,
  })
  const { homeEntryId, items, color, id, autoplay, index } = props
  const itemsWithRelatedData = useVideoCarouselData(items, id)

  const hasItems = itemsWithRelatedData.length > 0
  const videoSources = videoSourceExtractor(itemsWithRelatedData)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoplay ? true : false)
  const [hasFinishedPlaying, setHasFinishedPlaying] = useState(false)

  useEffect(() => {
    analytics.logModuleDisplayedOnHomepage({
      moduleId: id,
      moduleType: ContentTypes.VIDEO_CAROUSEL,
      index,
      homeEntryId,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    analytics.logConsultVideo({
      from: 'video_carousel_block',
      moduleId: id,
      homeEntryId,
      youtubeId: videoSources[nextIndex],
    })
  }

  if (!hasItems || !hasGraphicRedesign) return null

  const renderItem = ({ item, index }: { item: EnrichedVideoCarouselItem; index: number }) => {
    if (!item) {
      return null
    }
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
              analytics.logConsultOffer({
                offerId: +offer.objectID,
                moduleId: item.id,
                from: 'video_carousel_block',
                homeEntryId,
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
          moduleItemId: item.id,
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
    <View testID="MarketingBlockContentDesktop">
      <Container>
        <PlaylistArrowButton
          direction="right"
          onPress={() => {
            setCurrentIndex(currentIndex - 1)
          }}
        />
        <VerticalVideoPlayer
          videoSources={videoSources}
          playNextVideo={playNextVideo}
          currentIndex={currentIndex}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          hasFinishedPlaying={hasFinishedPlaying}
          setHasFinishedPlaying={setHasFinishedPlaying}
          moduleId={id}
        />
        <ContainerAttachedOfferCardWithBar>
          {itemsWithRelatedData[0] && itemsWithRelatedData.length > 1 ? (
            renderItem({ item: itemsWithRelatedData[0], index: 1 })
          ) : (
            <SingleAttachedItem />
          )}
          <BarContainer>
            {itemsWithRelatedData.map((_, index) => (
              <CarouselBar animValue={progressValue} index={index} key={index} />
            ))}
          </BarContainer>
        </ContainerAttachedOfferCardWithBar>
        <PlaylistArrowButton direction="left" onPress={() => playNextVideo()} />
      </Container>
      <ColoredAttachedTileContainer color={color} />
    </View>
  )
}

const Container = styled.View({
  alignContent: 'center',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: getSpacing(11),
  margin: getSpacing(6),
})

const ColoredAttachedTileContainer = styled.View<{
  color: Color
}>(({ color, theme }) => ({
  backgroundColor: newColorMapping[color].fill,
  height: COLORED_BACKGROUND_HEIGHT,
  position: 'absolute',
  width: '100%',
  zIndex: theme.zIndex.background,
  top: 0,
  bottom: 0,
  margin: 'auto',
}))

const StyledInternalTouchableLink = styled(InternalTouchableLink)({})

const BarContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
  paddingBottom: getSpacing(1),
})

const ContainerAttachedOfferCardWithBar = styled.View({
  flexDirection: 'column',
  gap: getSpacing(8),
  width: ATTACHED_CARD_WIDTH,
})
const SingleItemContainer = styled.View({
  marginHorizontal: getSpacing(5),
  marginVertical: getSpacing(4),
})
