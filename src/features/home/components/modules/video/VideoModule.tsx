import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useEffect } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { VideoModuleDesktop } from 'features/home/components/modules/video/VideoModuleDesktop'
import { VideoModuleMobile } from 'features/home/components/modules/video/VideoModuleMobile'
import { useVideoOffersQuery } from 'features/home/queries/useVideoOffersQuery'
import { VideoModuleProps, VideoModule as VideoModuleType } from 'features/home/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { ContentTypes } from 'libs/contentful/types'

interface VideoModuleBaseProps extends VideoModuleType {
  index: number
  homeEntryId: string
  shouldShowModal: boolean
}

const VideoModuleContent: FunctionComponent<VideoModuleProps> = (props) => {
  const { isDesktopViewport } = useTheme()

  const videoModule = {
    DESKTOP: <VideoModuleDesktop {...props} />,
    MOBILE: <VideoModuleMobile {...props} />,
  }

  return isDesktopViewport ? videoModule.DESKTOP : videoModule.MOBILE
}

export const VideoModule: FunctionComponent<VideoModuleBaseProps> = (props) => {
  const { navigate } = useNavigation<UseNavigationType>()

  const { offers } = useVideoOffersQuery(
    props.offersModuleParameters,
    props.id,
    props.offerIds,
    props.eanList
  )

  const shouldModuleBeDisplayed = offers.length > 0
  const isMultiOffer = offers.length > 1

  useEffect(() => {
    if (shouldModuleBeDisplayed) {
      void analytics.logModuleDisplayedOnHomepage({
        moduleId: props.id,
        moduleType: ContentTypes.VIDEO,
        index: props.index,
        homeEntryId: props.homeEntryId,
        offers: offers.length ? offers.map((offer) => offer.objectID) : undefined,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldModuleBeDisplayed])

  if (!shouldModuleBeDisplayed) return null

  const analyticsParams: OfferAnalyticsParams = {
    moduleId: props.id,
    moduleName: props.title,
    from: 'home',
    homeEntryId: props.homeEntryId,
  }

  const videoModuleParams = {
    isMultiOffer,
    analyticsParams,
    onVideoPlaceholderPress: () => {
      navigate('VideoModulePage', {
        moduleId: props.id,
        moduleName: props.title,
        homeEntryId: props.homeEntryId,
        offersModuleParameters: props.offersModuleParameters,
        youtubeVideoId: props.youtubeVideoId,
        isMultiOffer,
        videoTag: props.videoTag,
        videoPublicationDate: props.videoPublicationDate,
        videoDescription: props.videoDescription,
        offerTitle: props.offerTitle,
        color: props.color,
        videoTitle: props.videoTitle,
        offerIds: props.offerIds,
        eanList: props.eanList,
        transcription: props.transcription,
      })
    },
    offers,
  }

  return (
    <Container>
      <VideoModuleContent {...props} {...videoModuleParams} />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  paddingBottom: theme.home.spaceBetweenModules,
}))
