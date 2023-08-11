import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { BlackCaption } from 'features/home/components/BlackCaption'
import { BlackGradient } from 'features/home/components/BlackGradient'
import { TEXT_BACKGROUND_OPACITY } from 'features/home/components/constants'
import { VideoMonoOfferTile } from 'features/home/components/modules/video/VideoMonoOfferTile'
import { VideoMultiOfferPlaylist } from 'features/home/components/modules/video/VideoMultiOfferPlaylist'
import { VideoModuleProps } from 'features/home/types'
import { Play } from 'ui/svg/icons/Play'
import { Spacer, Typo, getSpacing } from 'ui/theme'
import { gradientColorsMapping } from 'ui/theme/gradientColorsMapping'

const THUMBNAIL_HEIGHT = getSpacing(45)
// We do not center the player icon, because when the title is 2-line long,
// the title is to close to the player. So the player is closer to the top.
const PLAYER_TOP_MARGIN = getSpacing(12.5)
const PLAYER_SIZE = getSpacing(14.5)

const GRADIENT_START_POSITION = PLAYER_TOP_MARGIN + PLAYER_SIZE / 2

const COLOR_CATEGORY_BACKGROUND_HEIGHT_MULTI_OFFER =
  THUMBNAIL_HEIGHT - GRADIENT_START_POSITION + getSpacing(16)

export const VideoModuleMobile: FunctionComponent<VideoModuleProps> = (props) => {
  const videoDuration = `${props.durationInMinutes} min`

  const colorCategoryBackgroundHeightUniqueOffer =
    THUMBNAIL_HEIGHT - GRADIENT_START_POSITION + getSpacing(43)

  return (
    <Container>
      <StyledTitleContainer>
        <StyledTitleComponent>{props.title}</StyledTitleComponent>
      </StyledTitleContainer>
      <Spacer.Column numberOfSpaces={5} />

      <View testID="mobile-video-module">
        <ColorCategoryBackground
          colorCategoryBackgroundHeightUniqueOffer={colorCategoryBackgroundHeightUniqueOffer}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={gradientColorsMapping[props.color]}
          isMultiOffer={props.isMultiOffer}
        />
        <VideoOfferContainer>
          <StyledTouchableHighlight
            onPress={props.showVideoModal}
            testID="video-thumbnail"
            accessibilityRole="button">
            <Thumbnail source={{ uri: props.videoThumbnail }}>
              <DurationCaption label={videoDuration} />
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
          <Spacer.Column numberOfSpaces={2} />
          {!props.isMultiOffer && (
            <StyledVideoMonoOfferTile
              offer={props.offers[0]}
              color={props.color}
              hideModal={props.hideVideoModal}
              analyticsParams={props.analyticsParams}
            />
          )}
        </VideoOfferContainer>
      </View>
      {!!props.isMultiOffer && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={2} />
          <VideoMultiOfferPlaylist
            offers={props.offers}
            hideModal={props.hideVideoModal}
            analyticsParams={props.analyticsParams}
          />
        </React.Fragment>
      )}
      {!props.isMultiOffer && <Spacer.Column numberOfSpaces={6} />}
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
  // the overflow: hidden allow to add border radius to the image
  // https://stackoverflow.com/questions/49442165/how-do-you-add-borderradius-to-imagebackground/57616397
  overflow: 'hidden',
  borderRadius: theme.borderRadius.radius,
  height: THUMBNAIL_HEIGHT,
  width: '100%',
  border: 1,
  borderColor: theme.colors.greyMedium,
  backgroundColor: theme.colors.greyLight,
}))

const DurationCaption = styled(BlackCaption)({
  position: 'absolute',
  top: getSpacing(2),
  right: getSpacing(2),
})

const PlayerContainer = styled.View({
  position: 'absolute',
  top: PLAYER_TOP_MARGIN,
  left: 0,
  right: 0,
  alignItems: 'center',
})

const ColorCategoryBackground = styled(LinearGradient)<{
  colorCategoryBackgroundHeightUniqueOffer: number
  isMultiOffer: boolean
}>(({ colorCategoryBackgroundHeightUniqueOffer, isMultiOffer }) => ({
  position: 'absolute',
  top: GRADIENT_START_POSITION,
  right: 0,
  left: 0,
  height: isMultiOffer
    ? COLOR_CATEGORY_BACKGROUND_HEIGHT_MULTI_OFFER
    : colorCategoryBackgroundHeightUniqueOffer,
}))

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

const StyledVideoMonoOfferTile = styled(VideoMonoOfferTile)({
  flexGrow: 1,
})
