import React, { FunctionComponent, useEffect } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { useVideoOffers } from 'features/home/api/useVideoOffers'
import { OldVideoModuleDesktop } from 'features/home/components/modules/video/OldVideoModuleDesktop'
import { OldVideoModuleMobile } from 'features/home/components/modules/video/OldVideoModuleMobile'
import { VideoModal } from 'features/home/components/modules/video/VideoModal'
import { VideoModuleDesktop } from 'features/home/components/modules/video/VideoModuleDesktop'
import { VideoModuleMobile } from 'features/home/components/modules/video/VideoModuleMobile'
import { VideoModuleProps, VideoModule as VideoModuleType } from 'features/home/types'
import { analytics } from 'libs/analytics/provider'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { ContentTypes } from 'libs/contentful/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useModal } from 'ui/components/modals/useModal'

interface VideoModuleBaseProps extends VideoModuleType {
  index: number
  homeEntryId: string
  shouldShowModal: boolean
}

const VideoModuleFF: FunctionComponent<VideoModuleProps> = (props) => {
  const theme = useTheme()

  const enableMultiVideoModule = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_APP_V2_MULTI_VIDEO_MODULE
  )

  const videoModule = {
    DESKTOP: enableMultiVideoModule ? (
      <VideoModuleDesktop {...props} />
    ) : (
      <OldVideoModuleDesktop {...props} />
    ),
    MOBILE: enableMultiVideoModule ? (
      <VideoModuleMobile {...props} />
    ) : (
      <OldVideoModuleMobile {...props} />
    ),
  }

  return theme.isDesktopViewport ? videoModule.DESKTOP : videoModule.MOBILE
}

export const VideoModule: FunctionComponent<VideoModuleBaseProps> = (props) => {
  const {
    visible: videoModalVisible,
    showModal: showVideoModal,
    hideModal: hideVideoModal,
  } = useModal(props.shouldShowModal)

  const { offers } = useVideoOffers(
    props.offersModuleParameters,
    props.id,
    props.offerIds,
    props.eanList
  )

  const shouldModuleBeDisplayed = offers.length > 0
  const isMultiOffer = offers.length > 1

  useEffect(() => {
    if (shouldModuleBeDisplayed) {
      analytics.logModuleDisplayedOnHomepage({
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
    showVideoModal,
    hideVideoModal,
    offers,
  }

  return (
    <Container>
      <VideoModuleFF {...props} {...videoModuleParams} />

      <VideoModal
        visible={videoModalVisible}
        hideModal={hideVideoModal}
        offers={offers}
        moduleId={props.id}
        isMultiOffer={isMultiOffer}
        {...props}
      />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  paddingBottom: theme.home.spaceBetweenModules,
}))
