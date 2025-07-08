import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { Animated, useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { RATIO169 } from 'features/home/components/helpers/getVideoPlayerDimensions'
import { YoutubePlayer } from 'features/home/components/modules/video/YoutubePlayer/YoutubePlayer'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { videoDataFixture } from 'features/offer/fixtures/videoDataFixture'
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

  return (
    <Container>
      <ContentHeader
        headerTitle={`Vidéo ${offer?.name ?? ''}`}
        headerTransition={interpolated}
        titleTestID="offerVideoPreviewHeader"
        onBackPress={goBack}
      />

      <YoutubePlayer
        videoId={videoDataFixture.videoId}
        height={videoHeight}
        width={viewportWidth < MAX_WIDTH ? undefined : MAX_WIDTH}
        initialPlayerParams={{ autoplay: true }}
        thumbnail={<VideoThumbnailImage url={videoDataFixture.thumbnailUri} resizeMode="cover" />}
      />
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
