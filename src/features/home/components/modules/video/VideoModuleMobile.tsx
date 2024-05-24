import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { AttachedOfferCard } from 'features/home/components/AttachedOfferCard'
import { BlackCaption } from 'features/home/components/BlackCaption'
import { BlackGradient } from 'features/home/components/BlackGradient'
import { TEXT_BACKGROUND_OPACITY } from 'features/home/components/constants'
import { VideoMonoOfferTile } from 'features/home/components/modules/video/VideoMonoOfferTile'
import { VideoMultiOfferPlaylist } from 'features/home/components/modules/video/VideoMultiOfferPlaylist'
import { VideoModuleProps } from 'features/home/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useCategoryIdMapping } from 'libs/subcategories'
import { theme } from 'theme'
import { Play } from 'ui/svg/icons/Play'
import { Spacer, Typo, getSpacing } from 'ui/theme'
import { gradientColorsMapping } from 'ui/theme/gradientColorsMapping'

const newGradientColorsMapping = {
  Gold: [theme.colors.goldLight100, theme.colors.goldLight100],
  Aquamarine: [theme.colors.aquamarineLight, theme.colors.aquamarineLight],
  SkyBlue: [theme.colors.skyBlueLight, theme.colors.skyBlueLight],
  DeepPink: [theme.colors.deepPinkLight, theme.colors.deepPinkLight],
  Coral: [theme.colors.coralLight, theme.colors.coralLight],
  Lilac: [theme.colors.lilacLight, theme.colors.lilacLight],
}

const THUMBNAIL_HEIGHT = getSpacing(52.5)
// We do not center the player icon, because when the title is 2-line long,
// the title is to close to the player. So the player is closer to the top.
const PLAYER_TOP_MARGIN = getSpacing(12.5)
const PLAYER_SIZE = getSpacing(14.5)

const GRADIENT_START_POSITION = PLAYER_TOP_MARGIN + PLAYER_SIZE / 2

const COLOR_CATEGORY_BACKGROUND_HEIGHT_MULTI_OFFER =
  THUMBNAIL_HEIGHT - GRADIENT_START_POSITION + getSpacing(16)

const NEW_PLAYER_SIZE = getSpacing(24)

export const VideoModuleMobile: FunctionComponent<VideoModuleProps> = (props) => {
  const enableMultiVideoModule = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_APP_V2_MULTI_VIDEO_MODULE
  )

  const videoDuration = `${props.durationInMinutes} min`

  const colorCategoryBackgroundHeightUniqueOffer =
    THUMBNAIL_HEIGHT - GRADIENT_START_POSITION + getSpacing(43)

  const mapping = useCategoryIdMapping()
  const categoryId = mapping[props.offers[0].offer.subcategoryId]

  console.log({ offers: props.offers })
  /// https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/thumbs/mediations/DU_1
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
          colors={
            enableMultiVideoModule
              ? newGradientColorsMapping[props.color]
              : gradientColorsMapping[props.color]
          }
          isMultiOffer={false}
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
          <Spacer.Column numberOfSpaces={2} />
          {false ? null : enableMultiVideoModule ? (
            <AttachedOfferCard
              title={props.offers[0]?.offer.name ?? ''}
              categoryId={categoryId}
              imageUrl={props.offers[0]?.offer.thumbUrl}
              showImage
              tag="string"
              withRightArrow
              geoloc={props.offers[0]?._geoloc}
              date={props.offers[0]?.offer.dates}
              price={props.offers[0]?.offer.prices[0]}
            />
          ) : (
            <StyledVideoMonoOfferTile
              // @ts-expect-error: because of noUncheckedIndexedAccess
              offer={props.offers[0]}
              color={props.color}
              hideModal={props.hideVideoModal}
              analyticsParams={props.analyticsParams}
            />
          )}
        </VideoOfferContainer>
      </View>
      {false ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={2} />
          <VideoMultiOfferPlaylist
            offers={props.offers}
            hideModal={props.hideVideoModal}
            analyticsParams={props.analyticsParams}
          />
        </React.Fragment>
      ) : null}
      {false ? null : <Spacer.Column numberOfSpaces={6} />}
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  paddingBottom: theme.home.spaceBetweenModules,
}))

const VideoOfferContainer = styled.View<{ enableMultiVideoModule: boolean }>(
  ({ theme, enableMultiVideoModule }) => ({
    marginHorizontal: enableMultiVideoModule ? undefined : theme.contentPage.marginHorizontal,
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
}>(({ colorCategoryBackgroundHeightUniqueOffer, isMultiOffer }) => ({
  position: 'absolute',
  top: GRADIENT_START_POSITION,
  right: 0,
  left: 0,
  height: isMultiOffer
    ? COLOR_CATEGORY_BACKGROUND_HEIGHT_MULTI_OFFER
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

const StyledVideoMonoOfferTile = styled(VideoMonoOfferTile)({
  flexGrow: 1,
})
