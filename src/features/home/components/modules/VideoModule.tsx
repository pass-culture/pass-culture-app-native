import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { BlackGradient } from 'features/home/components/BlackGradient'
import { TEXT_BACKGROUND_OPACITY } from 'features/home/components/constants'
import { Play } from 'ui/svg/icons/Play'
import { Spacer, Typo, getSpacing } from 'ui/theme'

const THUMBNAIL_HEIGHT = getSpacing(45)
// We do not center the player icon, because when the title is 2-line long,
// the title is to close to the player. So the player is closer to the top.
const PLAYER_TOP_MARGIN = getSpacing(12.5)

const PLAYER_SIZE = getSpacing(14.5)

type Props = {
  title: string
  videoTitle: string
  videoThumbnail: string
  durationInMinutes: number
}

export const VideoModule: FunctionComponent<Props> = ({
  title,
  videoThumbnail,
  videoTitle,
  durationInMinutes,
}) => {
  const videoDuration = `${durationInMinutes} min`

  return (
    <Container>
      <Typo.Title3>{title}</Typo.Title3>
      <Spacer.Column numberOfSpaces={5} />
      <Thumbnail source={{ uri: videoThumbnail }}>
        <DurationCaptionContainer>
          <DurationCaption>{videoDuration}</DurationCaption>
        </DurationCaptionContainer>
        <TextContainer>
          <BlackGradient />
          <BlackBackground>
            <VideoTitle numberOfLines={2}>{videoTitle}</VideoTitle>
          </BlackBackground>
        </TextContainer>
        <PlayerContainer>
          <Player />
        </PlayerContainer>
      </Thumbnail>
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  paddingBottom: theme.home.spaceBetweenModules,
}))

const Thumbnail = styled.ImageBackground(({ theme }) => ({
  //the overflow: hidden allow to add border radius to the image
  //https://stackoverflow.com/questions/49442165/how-do-you-add-borderradius-to-imagebackground/57616397
  overflow: 'hidden',
  borderRadius: theme.borderRadius.radius,
  height: THUMBNAIL_HEIGHT,
}))

const DurationCaptionContainer = styled.View(({ theme }) => ({
  position: 'absolute',
  top: getSpacing(2),
  right: getSpacing(2),
  backgroundColor: theme.colors.black,
  borderRadius: getSpacing(1),
  padding: getSpacing(1),
}))

const DurationCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.white,
}))

const PlayerContainer = styled.View({
  position: 'absolute',
  top: PLAYER_TOP_MARGIN,
  left: 0,
  right: 0,
  alignItems: 'center',
})

const Player = styled(Play).attrs({ size: PLAYER_SIZE })({})

const TextContainer = styled.View({ position: 'absolute', bottom: 0, left: 0, right: 0 })

const BlackBackground = styled.View(({ theme }) => ({
  padding: getSpacing(4),
  backgroundColor: colorAlpha(theme.colors.black, TEXT_BACKGROUND_OPACITY),
}))

const VideoTitle = styled(Typo.Title4)(({ theme }) => ({
  color: theme.colors.white,
}))
