import React, { ReactElement, useCallback } from 'react'
import { StyleProp, ViewStyle, useWindowDimensions } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { SubcategoryIdEnum } from 'api/gen'
import { RATIO169 } from 'features/home/components/helpers/getVideoPlayerDimensions'
import { YoutubePlayer } from 'features/home/components/modules/video/YoutubePlayer/YoutubePlayer'
import { FeedBackVideo } from 'features/offer/components/OfferContent/VideoSection/FeedBackVideo'
import { GatedVideoSection } from 'features/offer/components/OfferContent/VideoSection/GatedVideoSection'
import { MAX_WIDTH_VIDEO } from 'features/offer/constant'
import { formatDuration } from 'features/offer/helpers/formatDuration/formatDuration'
import { analytics } from 'libs/analytics/provider'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'

type VideoSectionProps = {
  title: string
  offerId: number
  offerSubcategory: SubcategoryIdEnum
  onManageCookiesPress: VoidFunction
  videoId?: string
  subtitle?: string
  videoThumbnail?: ReactElement
  style?: StyleProp<ViewStyle>
  maxWidth?: number
  playerRatio?: number
  userId?: number
  duration?: number | null
  hasVideoCookiesConsent?: boolean
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
  offerSubcategory,
  userId,
  duration,
  hasVideoCookiesConsent,
  onManageCookiesPress,
}: VideoSectionProps) => {
  const { isDesktopViewport } = useTheme()
  const { width: viewportWidth } = useWindowDimensions()
  const videoHeight = Math.min(viewportWidth, maxWidth) * playerRatio

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
          width={viewportWidth < maxWidth ? undefined : maxWidth}
          initialPlayerParams={{ autoplay: true }}
          duration={duration ? formatDuration(duration, 'sec') : undefined}
          onPlayPress={() => analytics.logConsultVideo({ from: 'offer', offerId: String(offerId) })}
        />
        <FeedBackVideo offerId={offerId} offerSubcategory={offerSubcategory} userId={userId} />
      </React.Fragment>
    )
  }, [
    duration,
    maxWidth,
    offerId,
    offerSubcategory,
    subtitle,
    title,
    userId,
    videoHeight,
    videoId,
    videoThumbnail,
    viewportWidth,
  ])

  const renderGatedVideoSection = useCallback(() => {
    return (
      <GatedVideoSection
        thumbnail={videoThumbnail}
        title={title}
        duration={duration ? formatDuration(duration, 'sec') : undefined}
        height={videoHeight}
        width={viewportWidth < maxWidth ? undefined : maxWidth}
        onManageCookiesPress={onManageCookiesPress}
      />
    )
  }, [duration, maxWidth, title, videoHeight, videoThumbnail, viewportWidth])

  return (
    <React.Fragment>
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
    </React.Fragment>
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
}))
