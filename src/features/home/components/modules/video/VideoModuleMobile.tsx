import colorAlpha from 'color-alpha'
import React, { FunctionComponent, useState } from 'react'
import { LayoutChangeEvent, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { BlackCaption } from 'features/home/components/BlackCaption'
import { BlackGradient } from 'features/home/components/BlackGradient'
import { TEXT_BACKGROUND_OPACITY } from 'features/home/components/constants'
import { VideoMonoOfferTile } from 'features/home/components/modules/video/VideoMonoOfferTile'
import { VideoMultiOfferPlaylist } from 'features/home/components/modules/video/VideoMultiOfferPlaylist'
import { VideoModuleProps } from 'features/home/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { Play } from 'ui/svg/icons/Play'
import { Spacer, Typo, getSpacing } from 'ui/theme'
import { gradientColorsMapping } from 'ui/theme/gradientColorsMapping'
import { videoModuleMobileColorsMapping } from 'ui/theme/videoModuleMobileColorsMapping'

const THUMBNAIL_HEIGHT = getSpacing(52.5)
// We do not center the player icon, because when the title is 2-line long,
// the title is to close to the player. So the player is closer to the top.
const PLAYER_TOP_MARGIN = getSpacing(12.5)
const PLAYER_SIZE = getSpacing(14.5)
const GRADIENT_START_POSITION = PLAYER_TOP_MARGIN + PLAYER_SIZE / 2
const COLOR_CATEGORY_BACKGROUND_HEIGHT = getSpacing(37.5)
const VIDEO_THUMBNAIL_HEIGHT = THUMBNAIL_HEIGHT - GRADIENT_START_POSITION
const MONO_OFFER_CARD_VERTICAL_SPACING = getSpacing(8)
const NEW_PLAYER_SIZE = getSpacing(24)

const getColorCategoryBackgroundHeightMultiOffer = (enableMultiVideoModule: boolean) =>
  enableMultiVideoModule
    ? VIDEO_THUMBNAIL_HEIGHT + COLOR_CATEGORY_BACKGROUND_HEIGHT
    : VIDEO_THUMBNAIL_HEIGHT + getSpacing(16)

export const VideoModuleMobile: FunctionComponent<VideoModuleProps> = (props) => {
  const [monoOfferCardHeight, setMonoOfferCardHeight] = useState<number>(0)
  const enableMultiVideoModule = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_APP_V2_MULTI_VIDEO_MODULE
  )

  const MONO_OFFER_CARD_HEIGHT = enableMultiVideoModule ? monoOfferCardHeight : getSpacing(43)
  const colorCategoryBackgroundHeightUniqueOffer =
    VIDEO_THUMBNAIL_HEIGHT + MONO_OFFER_CARD_VERTICAL_SPACING + MONO_OFFER_CARD_HEIGHT

  const videoDuration = `${props.durationInMinutes} min`

  return (
    <Container>
      <StyledTitleContainer>
        <StyledTitleComponent>{props.title}</StyledTitleComponent>
      </StyledTitleContainer>
      <Spacer.Column numberOfSpaces={5} />

      <View testID="mobile-video-module">
        <ColorCategoryBackground
          enableMultiVideoModule={enableMultiVideoModule}
          colorCategoryBackgroundHeightUniqueOffer={colorCategoryBackgroundHeightUniqueOffer}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={
            enableMultiVideoModule
              ? videoModuleMobileColorsMapping[props.color]
              : gradientColorsMapping[props.color]
          }
          isMultiOffer={props.isMultiOffer}
        />
        <VideoOfferContainer enableMultiVideoModule={enableMultiVideoModule}>
          <StyledTouchableHighlight
            onPress={props.showVideoModal}
            testID="video-thumbnail"
            accessibilityRole="button">
            <Thumbnail source={{ uri: props.videoThumbnail }}>
              {enableMultiVideoModule ? null : <DurationCaption label={videoDuration} />}
              <TextContainer>
                <BlackGradient />
                <BlackBackground>
                  {enableMultiVideoModule ? (
                    <NewVideoTitle numberOfLines={1} ellipsizeMode="tail">
                      {props.videoTitle}
                    </NewVideoTitle>
                  ) : (
                    <VideoTitle numberOfLines={2}>{props.videoTitle}</VideoTitle>
                  )}
                </BlackBackground>
              </TextContainer>
              <PlayerContainer>
                <Player enableMultiVideoModule={!!enableMultiVideoModule} />
              </PlayerContainer>
            </Thumbnail>
          </StyledTouchableHighlight>
          <Spacer.Column numberOfSpaces={enableMultiVideoModule ? 4 : 2} />
          {props.isMultiOffer ? null : (
            <View
              onLayout={(event: LayoutChangeEvent) => {
                const { height } = event.nativeEvent.layout
                setMonoOfferCardHeight(height)
              }}>
              <StyledVideoMonoOfferTile
                // @ts-expect-error: because of noUncheckedIndexedAccess
                offer={props.offers[0]}
                color={props.color}
                hideModal={props.hideVideoModal}
                analyticsParams={props.analyticsParams}
                enableMultiVideoModule={enableMultiVideoModule}
              />
            </View>
          )}
        </VideoOfferContainer>
      </View>
      {props.isMultiOffer ? (
        <React.Fragment>
          {enableMultiVideoModule ? null : <Spacer.Column numberOfSpaces={2} />}
          <VideoMultiOfferPlaylist
            offers={props.offers}
            hideModal={props.hideVideoModal}
            analyticsParams={props.analyticsParams}
          />
        </React.Fragment>
      ) : null}
      {props.isMultiOffer ? null : <Spacer.Column numberOfSpaces={4} />}
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  paddingBottom: theme.home.spaceBetweenModules,
}))

const VideoOfferContainer = styled.View<{ enableMultiVideoModule: boolean }>(
  ({ theme, enableMultiVideoModule }) => ({
    marginHorizontal: enableMultiVideoModule ? 0 : theme.contentPage.marginHorizontal,
  })
)

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
  enableMultiVideoModule: boolean
}>(({ colorCategoryBackgroundHeightUniqueOffer, isMultiOffer, enableMultiVideoModule }) => ({
  position: 'absolute',
  top: GRADIENT_START_POSITION,
  right: 0,
  left: 0,
  height: isMultiOffer
    ? getColorCategoryBackgroundHeightMultiOffer(enableMultiVideoModule)
    : colorCategoryBackgroundHeightUniqueOffer,
}))

type EnableMultiVideoModuleFFProps = { enableMultiVideoModule: boolean }
const Player = styled(Play).attrs<EnableMultiVideoModuleFFProps>(
  ({ theme, enableMultiVideoModule }) =>
    enableMultiVideoModule
      ? {
          size: NEW_PLAYER_SIZE,
          color: theme.colors.brownLight,
        }
      : {
          size: PLAYER_SIZE,
        }
)<EnableMultiVideoModuleFFProps>({})

const TextContainer = styled.View({ position: 'absolute', bottom: 0, left: 0, right: 0 })

const BlackBackground = styled.View(({ theme }) => ({
  padding: getSpacing(4),
  backgroundColor: colorAlpha(theme.colors.black, TEXT_BACKGROUND_OPACITY),
}))

const VideoTitle = styled(Typo.Title4)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'left',
}))

const NewVideoTitle = styled(Typo.Title3)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
  textTransform: 'uppercase',
  fontSize: getSpacing(6.5),
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

const StyledVideoMonoOfferTile = styled(VideoMonoOfferTile)<{ enableMultiVideoModule: boolean }>(
  ({ enableMultiVideoModule, theme }) => ({
    flexGrow: 1,
    marginHorizontal: enableMultiVideoModule ? theme.contentPage.marginHorizontal : 0,
  })
)
