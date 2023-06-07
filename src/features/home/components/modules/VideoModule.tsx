import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { BlackGradient } from 'features/home/components/BlackGradient'
import { TEXT_BACKGROUND_OPACITY } from 'features/home/components/constants'
import { VideoModal } from 'features/home/components/modals/VideoModal'
import { VideoModule as VideoModuleProps } from 'features/home/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { useModal } from 'ui/components/modals/useModal'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Play } from 'ui/svg/icons/Play'
import { Spacer, Typo, getSpacing } from 'ui/theme'

const THUMBNAIL_HEIGHT = getSpacing(45)
// We do not center the player icon, because when the title is 2-line long,
// the title is to close to the player. So the player is closer to the top.
const PLAYER_TOP_MARGIN = getSpacing(12.5)
const PLAYER_SIZE = getSpacing(14.5)

const OFFER_INSERT_HEIGHT = getSpacing(35)
const COLOR_CATEGORY_BACKGROUND_HEIGHT = getSpacing(76)

export const VideoModule: FunctionComponent<VideoModuleProps> = (props) => {
  const {
    visible: videoModalVisible,
    showModal: showVideoModal,
    hideModal: hideVideoModal,
  } = useModal(false)
  const videoDuration = `${props.durationInMinutes} min`

  return (
    <Container>
      <ColorCategoryBackground
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={['#27DCA8FF', '#0E8474FF']}
      />
      <VideoOfferContainer>
        <Typo.Title3>{props.title}</Typo.Title3>
        <Spacer.Column numberOfSpaces={5} />
        <StyledTouchable onPress={showVideoModal} testID={'video-thumbnail'}>
          <Thumbnail source={{ uri: props.videoThumbnail }}>
            <DurationCaptionContainer>
              <DurationCaption>{videoDuration}</DurationCaption>
            </DurationCaptionContainer>
            <TextContainer>
              <BlackGradient />
              <BlackBackground>
                <VideoTitle numberOfLines={2}>{props.videoTitle}</VideoTitle>
              </BlackBackground>
            </TextContainer>
            <PlayerContainer>
              <Player />
            </PlayerContainer>
          </Thumbnail>
        </StyledTouchable>
        <VideoModal visible={videoModalVisible} hideModal={hideVideoModal} {...props} />
      </VideoOfferContainer>
      <Spacer.Column numberOfSpaces={2} />
      <VideoOfferContainer>
        <OfferInsert />
      </VideoOfferContainer>
      <Spacer.Column numberOfSpaces={2} />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  paddingBottom: theme.home.spaceBetweenModules,
}))

const VideoOfferContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const Thumbnail = styled.ImageBackground(({ theme }) => ({
  //the overflow: hidden allow to add border radius to the image
  //https://stackoverflow.com/questions/49442165/how-do-you-add-borderradius-to-imagebackground/57616397
  overflow: 'hidden',
  borderRadius: theme.borderRadius.radius,
  height: THUMBNAIL_HEIGHT,
  width: '100%',
}))

const OfferInsert = styled.View(({ theme }) => ({
  //the overflow: hidden allow to add border radius to the image
  //https://stackoverflow.com/questions/49442165/how-do-you-add-borderradius-to-imagebackground/57616397
  overflow: 'hidden',
  borderRadius: theme.borderRadius.radius,
  height: OFFER_INSERT_HEIGHT,
  backgroundColor: theme.colors.white,
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

const ColorCategoryBackground = styled(LinearGradient)({
  position: 'absolute',
  top: getSpacing(20),
  right: 0,
  left: 0,
  height: COLOR_CATEGORY_BACKGROUND_HEIGHT,
})

const Player = styled(Play).attrs({ size: PLAYER_SIZE })({})

const TextContainer = styled.View({ position: 'absolute', bottom: 0, left: 0, right: 0 })

const BlackBackground = styled.View(({ theme }) => ({
  padding: getSpacing(4),
  backgroundColor: colorAlpha(theme.colors.black, TEXT_BACKGROUND_OPACITY),
}))

const VideoTitle = styled(Typo.Title4)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'left',
}))

const StyledTouchable = styledButton(Touchable)``
