import React, { ReactElement } from 'react'
import { StyleProp, View, ViewStyle, useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { RATIO169 } from 'features/home/components/helpers/getVideoPlayerDimensions'
import { YoutubePlayer } from 'features/home/components/modules/video/YoutubePlayer/YoutubePlayer'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type VideoSectionProps = {
  videoId?: string
  title: string
  subtitle?: string
  videoThumbnail?: ReactElement
  style?: StyleProp<ViewStyle>
  maxWidth?: number
  playerRatio?: number
}

const MAX_WIDTH = 800

export const VideoSection = ({
  videoId,
  title,
  subtitle,
  videoThumbnail,
  style,
  maxWidth = MAX_WIDTH,
  playerRatio = RATIO169,
}: VideoSectionProps) => {
  const { width: viewportWidth } = useWindowDimensions()
  const videoHeight = Math.min(viewportWidth, maxWidth) * playerRatio

  return (
    <Container style={style}>
      <Typo.Title3 {...getHeadingAttrs(3)}>{title}</Typo.Title3>
      {subtitle ? <StyledBodyAccentXs>{subtitle}</StyledBodyAccentXs> : null}
      <StyledYoutubePlayer
        videoId={videoId}
        thumbnail={videoThumbnail}
        height={videoHeight}
        width={viewportWidth < maxWidth ? undefined : maxWidth}
        initialPlayerParams={{ autoplay: true }}
      />
    </Container>
  )
}

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const Container = styled(View)(({ theme }) => ({
  paddingHorizontal: theme.contentPage.marginHorizontal,
  rowGap: theme.contentPage.marginVertical,
}))

const StyledYoutubePlayer = styled(YoutubePlayer)({
  borderRadius: 25,
  overflow: 'hidden',
  marginLeft: 'auto',
  marginRight: 'auto',
})
