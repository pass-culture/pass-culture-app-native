import React, { ReactElement, useCallback, useState } from 'react'
import { StyleProp, useWindowDimensions, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { RATIO169 } from 'features/home/components/helpers/getVideoPlayerDimensions'
import { YoutubePlayer } from 'features/home/components/modules/video/YoutubePlayer/YoutubePlayer'
import { GatedVideoSection } from 'features/offer/components/OfferContent/VideoSection/GatedVideoSection'
import { PORTRAIT_PLAYER_STYLE } from 'features/offer/components/OfferContent/VideoSection/portraitPlayerStyle'
import { MAX_HEIGHT_VIDEO_PORTRAIT, MAX_WIDTH_VIDEO } from 'features/offer/constant'
import { formatDuration } from 'features/offer/helpers/formatDuration/formatDuration'
import { getOfferVideoPlayerSize } from 'features/offer/helpers/getOfferVideoPlayerSize/getOfferVideoPlayerSize'
import { analytics } from 'libs/analytics/provider'
import { Anchor } from 'ui/components/anchor/Anchor'
import { AnchorNames } from 'ui/components/anchor/anchor-name'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'

type VideoSectionProps = {
  title: string
  offerId: number
  onManageCookiesPress: VoidFunction
  onVideoConsentPress: VoidFunction
  videoId?: string
  subtitle?: string
  videoThumbnail?: ReactElement
  style?: StyleProp<ViewStyle>
  maxWidth?: number
  playerRatio?: number
  duration?: number | null
  hasVideoCookiesConsent?: boolean
  isPortrait?: boolean
}

export const VideoSection = ({
  videoId,
  title,
  subtitle,
  videoThumbnail,
  style,
  maxWidth = MAX_WIDTH_VIDEO,
  playerRatio = RATIO169,
  offerId,
  duration,
  hasVideoCookiesConsent,
  isPortrait,
  onManageCookiesPress,
  onVideoConsentPress,
}: VideoSectionProps) => {
  const { isDesktopViewport, contentPage } = useTheme()
  const { width: viewportWidth, height: viewportHeight } = useWindowDimensions()
  const { width: playerWidth, height: videoHeight } = isPortrait
    ? getOfferVideoPlayerSize({
        isPortrait: true,
        viewportWidth,
        maxWidth,
        horizontalMargin: isDesktopViewport ? 0 : contentPage.marginHorizontal,
        maxHeight: isDesktopViewport ? MAX_HEIGHT_VIDEO_PORTRAIT : viewportHeight,
      })
    : getOfferVideoPlayerSize({ viewportWidth, maxWidth, playerRatio })
  const [playVideo, setPlayVideo] = useState(false)

  const handleOnPlayPress = useCallback(() => {
    void analytics.logConsultVideo({ from: 'offer', offerId: String(offerId) })
    setPlayVideo(true)
  }, [offerId])

  const renderVideoSection = useCallback(() => {
    return (
      <React.Fragment>
        <Typo.Title3>Vidéo</Typo.Title3>
        {subtitle ? <StyledBodyAccentXs>{subtitle}</StyledBodyAccentXs> : null}
        <StyledYoutubePlayer
          title={title}
          videoId={videoId}
          thumbnail={videoThumbnail}
          height={videoHeight}
          width={playerWidth}
          style={isPortrait ? PORTRAIT_PLAYER_STYLE : undefined}
          initialPlayerParams={{ autoplay: true }}
          duration={duration ? formatDuration(duration, 'sec') : undefined}
          onPlayPress={handleOnPlayPress}
          play={playVideo}
        />
      </React.Fragment>
    )
  }, [
    duration,
    handleOnPlayPress,
    isPortrait,
    playVideo,
    playerWidth,
    subtitle,
    title,
    videoHeight,
    videoId,
    videoThumbnail,
  ])

  const handleConsentAndPlay = useCallback(() => {
    onVideoConsentPress()
    setPlayVideo(true)
  }, [onVideoConsentPress])

  const renderGatedVideoSection = useCallback(() => {
    return (
      <GatedVideoSection
        thumbnail={videoThumbnail}
        title={title}
        duration={duration ? formatDuration(duration, 'sec') : undefined}
        height={videoHeight}
        width={playerWidth}
        isPortrait={isPortrait}
        onManageCookiesPress={onManageCookiesPress}
        onVideoConsentPress={handleConsentAndPlay}
      />
    )
  }, [
    duration,
    handleConsentAndPlay,
    isPortrait,
    onManageCookiesPress,
    playerWidth,
    title,
    videoHeight,
    videoThumbnail,
  ])

  return (
    <Anchor name={AnchorNames.VIDEO_PLAYBACK}>
      {isDesktopViewport ? (
        <ViewGap testID="video-section-without-divider" gap={4} style={style}>
          {hasVideoCookiesConsent ? renderVideoSection() : renderGatedVideoSection()}
        </ViewGap>
      ) : (
        <SectionWithDivider testID="video-section-with-divider" visible gap={4}>
          <Container gap={8}>
            {hasVideoCookiesConsent ? renderVideoSection() : renderGatedVideoSection()}
          </Container>
        </SectionWithDivider>
      )}
    </Anchor>
  )
}

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const Container = styled(ViewGap)(({ theme }) => ({
  paddingHorizontal: theme.contentPage.marginHorizontal,
}))

const StyledYoutubePlayer = styled(YoutubePlayer)(({ theme }) => ({
  borderRadius: theme.designSystem.size.borderRadius.m,
  overflow: 'hidden',
  borderColor: theme.designSystem.color.border.subtle,
  borderWidth: 1,
}))
