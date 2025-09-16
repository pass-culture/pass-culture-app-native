import React, { FunctionComponent, useEffect, useState } from 'react'
import { Platform, Text } from 'react-native'
import styled from 'styled-components/native'

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
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getSpacing } from 'ui/theme'
import { colorMapping } from 'ui/theme/colorMapping'

interface VideoCarouselModuleBaseProps extends VideoCarouselModuleType {
  index: number
  homeEntryId: string
  autoplay?: boolean
}

export const VideoCarouselModule: FunctionComponent<VideoCarouselModuleBaseProps> = (props) => {
  const prePopulateOffer = usePrePopulateOffer()
  const mapping = useCategoryIdMapping()

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
    } else {
      nextIndex = 0
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

      return (
        <StyledInternalTouchableLink
          key={index}
          color={color}
          navigateTo={{
            screen: 'Offer',
            params: { id: +offer.objectID },
          }}
          onBeforeNavigate={() => {
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
          }}>
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
    } as const

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
            <DotContainer>
              <Text>Dot</Text>
            </DotContainer>
          </React.Fragment>
        ) : (
          SingleItemWithRelatedData
        )}
      </ColoredAttachedTileContainer>
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
}))

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
  marginHorizontal: theme.designSystem.size.spacing.xs,
}))

const SingleItemContainer = styled.View(({ theme }) => ({
  marginHorizontal: getSpacing(5),
  marginVertical: theme.designSystem.size.spacing.l,
}))

const DotContainer = styled.View(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  flexDirection: 'row',
  justifyContent: 'center',
  paddingBottom: theme.designSystem.size.spacing.xs,
}))
