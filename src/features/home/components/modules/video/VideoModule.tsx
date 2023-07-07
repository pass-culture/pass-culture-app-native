import colorAlpha from 'color-alpha'
import React, { FunctionComponent, useEffect } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { useVideoOffers } from 'features/home/api/useVideoOffer'
import { BlackGradient } from 'features/home/components/BlackGradient'
import { TEXT_BACKGROUND_OPACITY } from 'features/home/components/constants'
import { getGradientColors } from 'features/home/components/helpers/getGradientColors'
import { OfferVideoModule } from 'features/home/components/modules/video/OfferVideoModule'
import { VideoModal } from 'features/home/components/modules/video/VideoModal'
import { VideoModule as VideoModuleType } from 'features/home/types'
import { analytics } from 'libs/analytics'
import { ContentTypes } from 'libs/contentful'
import { useModal } from 'ui/components/modals/useModal'
import { Play } from 'ui/svg/icons/Play'
import { Spacer, Typo, getSpacing } from 'ui/theme'

const THUMBNAIL_HEIGHT = getSpacing(45)
// We do not center the player icon, because when the title is 2-line long,
// the title is to close to the player. So the player is closer to the top.
const PLAYER_TOP_MARGIN = getSpacing(12.5)
const PLAYER_SIZE = getSpacing(14.5)

const GRADIENT_START_POSITION = PLAYER_TOP_MARGIN + getSpacing(5) + PLAYER_SIZE / 2
const COLOR_CATEGORY_BACKGROUND_HEIGHT =
  THUMBNAIL_HEIGHT - GRADIENT_START_POSITION + getSpacing(49.5)

interface VideoModuleProps extends VideoModuleType {
  index: number
  homeEntryId: string
}

export const VideoModule: FunctionComponent<VideoModuleProps> = (props) => {
  const {
    visible: videoModalVisible,
    showModal: showVideoModal,
    hideModal: hideVideoModal,
  } = useModal(false)
  const videoDuration = `${props.durationInMinutes} min`

  const { offers } = useVideoOffers(props.offersModuleParameters, props.id)

  const shouldModuleBeDisplayed = offers.length > 0
  const isMultiOffer = offers.length > 1

  useEffect(() => {
    if (shouldModuleBeDisplayed) {
      analytics.logModuleDisplayedOnHomepage(
        props.id,
        ContentTypes.VIDEO,
        props.index,
        props.homeEntryId
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldModuleBeDisplayed])

  if (!shouldModuleBeDisplayed) return <React.Fragment />

  return (
    <Container>
      <StyledTitleContainer>
        <StyledTitleComponent>{props.title}</StyledTitleComponent>
      </StyledTitleContainer>

      <StyledWrapper>
        <ColorCategoryBackground
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={getGradientColors(props.color)}
          isMultiOffer={isMultiOffer}
        />
        <VideoOfferContainer>
          <Spacer.Column numberOfSpaces={5} />
          <StyledTouchableHighlight
            onPress={showVideoModal}
            testID="video-thumbnail"
            accessibilityRole="button">
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
          </StyledTouchableHighlight>
          <VideoModal
            visible={videoModalVisible}
            hideModal={hideVideoModal}
            offer={offer}
            moduleId={props.id}
            {...props}
          />
          <Spacer.Column numberOfSpaces={2} />
          <OfferVideoModule
            offer={offer}
            color={props.color}
            hideModal={hideVideoModal}
            moduleId={props.id}
            moduleName={props.title}
            homeEntryId={props.homeEntryId}
            analyticsFrom={'home'}
          />
        </VideoOfferContainer>
      </StyledWrapper>
      <Spacer.Column numberOfSpaces={6} />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  paddingBottom: theme.home.spaceBetweenModules,
}))

const StyledWrapper = styled.View({})

const VideoOfferContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const Thumbnail = styled.ImageBackground(({ theme }) => ({
  // the overflow: hidden allow to add border radius to the image
  // https://stackoverflow.com/questions/49442165/how-do-you-add-borderradius-to-imagebackground/57616397
  overflow: 'hidden',
  borderRadius: theme.borderRadius.radius,
  height: THUMBNAIL_HEIGHT,
  width: '100%',
  border: 1,
  borderColor: theme.colors.greyMedium,
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
  top: GRADIENT_START_POSITION,
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

const StyledTouchableHighlight = styled.TouchableHighlight.attrs(({ theme }) => ({
  underlayColor: theme.colors.white,
}))(({ theme }) => ({
  borderRadius: theme.borderRadius.radius,
}))

const StyledTitleContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const StyledTitleComponent = styled(Typo.Title3).attrs({
  numberOfLines: 2,
})({})
