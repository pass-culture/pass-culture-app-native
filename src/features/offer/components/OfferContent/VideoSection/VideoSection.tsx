import React, { ReactElement, useCallback } from 'react'
import { StyleProp, ViewStyle, useWindowDimensions } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { SubcategoryIdEnum } from 'api/gen'
import { RATIO169 } from 'features/home/components/helpers/getVideoPlayerDimensions'
import { YoutubePlayer } from 'features/home/components/modules/video/YoutubePlayer/YoutubePlayer'
import { FeedBackVideo } from 'features/offer/components/OfferContent/VideoSection/FeedBackVideo'
import { MAX_WIDTH_VIDEO } from 'features/offer/constant'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type VideoSectionProps = {
  title: string
  offerId: number
  offerSubcategory: SubcategoryIdEnum
  videoId?: string
  subtitle?: string
  videoThumbnail?: ReactElement
  style?: StyleProp<ViewStyle>
  maxWidth?: number
  playerRatio?: number
  userId?: number
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
}: VideoSectionProps) => {
  const { isDesktopViewport } = useTheme()
  const { width: viewportWidth } = useWindowDimensions()
  const videoHeight = Math.min(viewportWidth, maxWidth) * playerRatio

  const renderVideoSection = useCallback(() => {
    return (
      <React.Fragment>
        <Typo.Title3 {...getHeadingAttrs(3)}>{title}</Typo.Title3>
        {subtitle ? <StyledBodyAccentXs>{subtitle}</StyledBodyAccentXs> : null}
        <StyledYoutubePlayer
          videoId={videoId}
          thumbnail={videoThumbnail}
          height={videoHeight}
          width={viewportWidth < maxWidth ? undefined : maxWidth}
          initialPlayerParams={{ autoplay: true }}
        />
        <FeedBackVideo offerId={offerId} offerSubcategory={offerSubcategory} userId={userId} />
      </React.Fragment>
    )
  }, [
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

  return (
    <React.Fragment>
      {isDesktopViewport ? (
        <ViewGap testID="video-section-without-divider" gap={4} style={style}>
          {renderVideoSection()}
        </ViewGap>
      ) : (
        <SectionWithDivider testID="video-section-with-divider" visible gap={4}>
          <Container gap={8}>{renderVideoSection()}</Container>
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
  borderRadius: theme.designSystem.size.borderRadius.xl,
  overflow: 'hidden',
}))
