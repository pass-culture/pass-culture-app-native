import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useState } from 'react'
import { Animated, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { YoutubePlayer } from 'features/home/components/modules/video/YoutubePlayer/YoutubePlayer'
import { UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { MAX_HEIGHT_VIDEO_PORTRAIT } from 'features/offer/constant'
import { formatDuration } from 'features/offer/helpers/formatDuration/formatDuration'
import { getOfferVideoPlayerSize } from 'features/offer/helpers/getOfferVideoPlayerSize/getOfferVideoPlayerSize'
import { useVideoOrientation } from 'features/offer/helpers/useVideoOrientation/useVideoOrientation'
import { analytics } from 'libs/analytics/provider'
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
  const { isDesktopViewport, appBarHeight, contentPage } = useTheme()
  const { top } = useSafeAreaInsets()
  const { width: viewportWidth, height: viewportHeight } = useWindowDimensions()
  const { data: offer } = useOfferQuery({ offerId: params.id })
  const { isPortrait, thumbnailUrl } = useVideoOrientation(offer?.video?.id)
  const headerHeight = appBarHeight + top
  const availableHeight = Math.max(0, viewportHeight - 2 * headerHeight)
  const { width: playerWidth, height: videoHeight } = isPortrait
    ? getOfferVideoPlayerSize({
        isPortrait: true,
        viewportWidth,
        maxWidth: MAX_WIDTH,
        horizontalMargin: isDesktopViewport ? 0 : contentPage.marginHorizontal,
        maxHeight: isDesktopViewport ? MAX_HEIGHT_VIDEO_PORTRAIT : availableHeight,
      })
    : getOfferVideoPlayerSize({ viewportWidth, maxWidth: MAX_WIDTH })
  const [playVideo, setPlayVideo] = useState(false)

  const handleOnPlayPress = useCallback(() => {
    if (offer?.id) {
      void analytics.logConsultVideo({ from: 'offer', offerId: String(offer.id) })
      setPlayVideo(true)
    }
  }, [offer?.id])

  return (
    <Container>
      <ContentHeader
        headerTitle={`Vidéo ${offer?.name ?? ''}`}
        headerTransition={interpolated}
        titleTestID="offerVideoPreviewHeader"
        onBackPress={goBack}
      />

      {offer?.video?.id ? (
        <YoutubePlayer
          title={offer.video.title ?? offer.name}
          videoId={offer.video.id}
          height={videoHeight}
          width={playerWidth}
          initialPlayerParams={{ autoplay: true }}
          thumbnail={
            <VideoThumbnailImage
              testID="video-thumbnail"
              url={thumbnailUrl ?? offer?.video.thumbUrl ?? ''}
              resizeMode="cover"
            />
          }
          duration={
            offer.video.durationSeconds
              ? formatDuration(offer.video.durationSeconds, 'sec')
              : undefined
          }
          onPlayPress={handleOnPlayPress}
          play={playVideo}
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
