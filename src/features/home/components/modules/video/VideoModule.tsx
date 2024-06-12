import React, { FunctionComponent, useEffect } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { useVideoOffers } from 'features/home/api/useVideoOffers'
import { OldVideoModuleMobile } from 'features/home/components/modules/video/OldVideoModuleMobile'
import { VideoModal } from 'features/home/components/modules/video/VideoModal'
import { VideoModuleDesktop } from 'features/home/components/modules/video/VideoModuleDesktop'
import { VideoModuleMobile } from 'features/home/components/modules/video/VideoModuleMobile'
import { VideoModule as VideoModuleType, VideoModuleProps } from 'features/home/types'
import { analytics } from 'libs/analytics'
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

const VideoModuleMobileFF: FunctionComponent<VideoModuleProps> = (props) => {
  const enableMultiVideoModule = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_APP_V2_MULTI_VIDEO_MODULE
  )

  return enableMultiVideoModule ? (
    <VideoModuleMobile {...props} />
  ) : (
    <OldVideoModuleMobile {...props} />
  )
}

export const VideoModule: FunctionComponent<VideoModuleBaseProps> = (props) => {
  const {
    visible: videoModalVisible,
    showModal: showVideoModal,
    hideModal: hideVideoModal,
  } = useModal(props.shouldShowModal)

  const theme = useTheme()

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
      {theme.isDesktopViewport ? (
        <VideoModuleDesktop {...props} {...videoModuleParams} />
      ) : (
        <VideoModuleMobileFF {...props} {...videoModuleParams} />
      )}
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
