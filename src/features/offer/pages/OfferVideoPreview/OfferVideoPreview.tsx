import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { Animated, useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { RATIO169 } from 'features/home/components/helpers/getVideoPlayerDimensions'
import { YoutubePlayer } from 'features/home/components/modules/video/YoutubePlayer/YoutubePlayer'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { formatDuration } from 'features/offer/helpers/formatDuration/formatDuration'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { useOfferQuery } from 'queries/offer/useOfferQuery'
import { ContentHeader } from 'ui/components/headers/ContentHeader'

const MAX_WIDTH = 800

const animatedValue = new Animated.Value(1)
const interpolated = animatedValue.interpolate({
  inputRange: [0, 1],
  outputRange: [0, 1],
})

export const OfferVideoPreview: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'OfferVideoPreview'>>()
  const { goBack } = useGoBack('Offer', { id: params.id })
  const { width: viewportWidth } = useWindowDimensions()
  const videoHeight = Math.min(viewportWidth, MAX_WIDTH) * RATIO169
  const { data: offer } = useOfferQuery({ offerId: params.id })
  const isVideoSectionEnabled = useFeatureFlag(RemoteStoreFeatureFlags.WIP_OFFER_VIDEO_SECTION)

  return (
    <Container>
      <ContentHeader
        headerTitle={`Vidéo ${offer?.name ?? ''}`}
        headerTransition={interpolated}
        titleTestID="offerVideoPreviewHeader"
        onBackPress={goBack}
      />

      {offer?.video?.id && isVideoSectionEnabled ? (
        <YoutubePlayer
          title={offer.video.title ?? offer.name}
          videoId={offer.video.id}
          height={videoHeight}
          width={viewportWidth < MAX_WIDTH ? undefined : MAX_WIDTH}
          initialPlayerParams={{ autoplay: true }}
          thumbnail={<VideoThumbnailImage url={offer?.video.thumbUrl ?? ''} resizeMode="cover" />}
          duration={
            offer.video.durationSeconds
              ? formatDuration(offer.video.durationSeconds, 'sec')
              : undefined
          }
        />
      ) : null}
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.designSystem.color.background.default,
}))

const VideoThumbnailImage = styled(FastImage)({
  width: '100%',
  height: '100%',
})
