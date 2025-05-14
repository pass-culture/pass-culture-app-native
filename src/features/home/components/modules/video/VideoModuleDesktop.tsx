import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
// eslint-disable-next-line no-restricted-imports
import { ImageBackground, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleTitle } from 'features/home/components/AccessibleTitle'
import { VideoMonoOfferTile } from 'features/home/components/modules/video/VideoMonoOfferTile'
import { VideoModuleProps } from 'features/home/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { Offer } from 'shared/offer/types'
import { SeeMoreWithEye } from 'ui/components/SeeMoreWithEye'
import { Separator } from 'ui/components/Separator'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'
import { Play } from 'ui/svg/icons/Play'
import { getSpacing, Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { videoModuleColorsMapping } from 'ui/theme/videoModuleColorsMapping'

const PLAYER_SIZE = getSpacing(24)
const THUMBNAIL_HEIGHT = getSpacing(93.5)
const THUMBNAIL_WIDTH = getSpacing(150)
const COLOR_CATEGORY_BACKGROUND_HEIGHT = getSpacing(55.5)
const COLOR_CATEGORY_BACKGROUND_WIDTH = getSpacing(160)

export const VideoModuleDesktop: FunctionComponent<VideoModuleProps> = (props) => {
  const theme = useTheme()
  const showSeeMore = props.offers.length > 3
  const hasOnlyTwoOffers = props.offers.length === 2
  const nbOfSeparators = hasOnlyTwoOffers ? 1 : 2

  function renderTitleSeeMore() {
    return showSeeMore && props.isMultiOffer ? (
      <SeeMoreWithEye title={props.videoTitle} onPressSeeMore={props.showVideoModal} />
    ) : null
  }

  function renderSoloOffer() {
    return props.offers[0] ? (
      <VideoMonoOfferTileWrapper>
        <VideoMonoOfferTile
          offer={props.offers[0]}
          color={props.color}
          hideModal={props.hideVideoModal}
          analyticsParams={props.analyticsParams}
        />
      </VideoMonoOfferTileWrapper>
    ) : null
  }

  const fillFromDesignSystem =
    theme.designSystem.color.background[videoModuleColorsMapping[props.color] ?? 'default']

  return (
    <React.Fragment>
      <StyledTitleContainer>
        <AccessibleTitle testID="playlistTitle" title={props.title} />
        {renderTitleSeeMore()}
      </StyledTitleContainer>
      <View testID="desktop-video-module">
        <ColorCategoryBackgroundWrapper>
          <ColorCategoryBackground
            backgroundColor={fillFromDesignSystem || videoModuleColorsMapping[props.color]}
            isMultiOffer={props.isMultiOffer}
          />
        </ColorCategoryBackgroundWrapper>
        <VideoOfferContainer isMultiOffer={props.isMultiOffer}>
          <StyledTouchableHighlight
            onPress={props.showVideoModal}
            testID="video-thumbnail"
            accessibilityRole={AccessibilityRole.BUTTON}
            isMultiOffer={props.isMultiOffer}>
            <Thumbnail source={{ uri: props.videoThumbnail }}>
              <BlackView />
              <TextContainer>
                <VideoTitle numberOfLines={1} ellipsizeMode="tail">
                  {props.videoTitle}
                </VideoTitle>
              </TextContainer>
              <PlayerContainer>
                <Player />
              </PlayerContainer>
            </Thumbnail>
          </StyledTouchableHighlight>
          <StyledView>
            {props.isMultiOffer ? (
              <StyledMultiOfferList hasOnlyTwoOffers={hasOnlyTwoOffers}>
                {props.offers.slice(0, 3).map((offer: Offer, index) => (
                  <React.Fragment key={offer.objectID}>
                    <StyledHorizontalOfferTile
                      offer={offer}
                      onPress={props.hideVideoModal}
                      analyticsParams={props.analyticsParams}
                    />
                    {index < nbOfSeparators ? (
                      <StyledSeparator hasOnlyTwoOffers={hasOnlyTwoOffers} />
                    ) : null}
                  </React.Fragment>
                ))}
              </StyledMultiOfferList>
            ) : (
              renderSoloOffer()
            )}
          </StyledView>
        </VideoOfferContainer>
      </View>
    </React.Fragment>
  )
}

const VideoMonoOfferTileWrapper = styled(View)({
  flexGrow: 1,
  marginHorizontal: getSpacing(8),
  justifyContent: 'center',
})

const StyledView = styled.View({
  flex: 1,
})

const BlackView = styled.View(({ theme }) => ({
  backgroundColor: colorAlpha(theme.colors.black, 0.6),
  height: THUMBNAIL_HEIGHT,
  justifyContent: 'center',
}))

const VideoOfferContainer = styled.View<{
  isMultiOffer: boolean
}>(({ theme, isMultiOffer }) => ({
  ...(isMultiOffer
    ? { marginHorizontal: theme.contentPage.marginHorizontal }
    : { marginLeft: theme.contentPage.marginHorizontal }),
  flexDirection: 'row',
  height: '100%',
}))

const Thumbnail = styled(ImageBackground)(({ theme }) => ({
  // the overflow: hidden allow to add border radius to the image
  // https://stackoverflow.com/questions/49442165/how-do-you-add-borderradius-to-imagebackground/57616397
  overflow: 'hidden',
  borderRadius: theme.borderRadius.radius,
  flex: 1,
}))

const PlayerContainer = styled(View)({
  position: 'absolute',
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
})

const ColorCategoryBackgroundWrapper = styled.View({
  position: 'absolute',
  left: 0,
  height: '100%',
  width: '100%',
  justifyContent: 'center',
})

const ColorCategoryBackground = styled.View<{
  isMultiOffer: boolean
  backgroundColor: ColorsEnum
}>(({ isMultiOffer, backgroundColor }) => ({
  height: COLOR_CATEGORY_BACKGROUND_HEIGHT,
  width: isMultiOffer ? COLOR_CATEGORY_BACKGROUND_WIDTH : '100%',
  backgroundColor,
}))

const Player = styled(Play).attrs(({ theme }) => ({
  size: PLAYER_SIZE,
  color: theme.colors.brownLight,
}))({})

const TextContainer = styled.View({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
})

const VideoTitle = styled(Typo.Title3)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
  textTransform: 'uppercase',
  fontSize: getSpacing(6.5),
  padding: getSpacing(4),
}))

const StyledTouchableHighlight = styled.TouchableHighlight.attrs(({ theme }) => ({
  underlayColor: theme.colors.white,
}))({
  height: THUMBNAIL_HEIGHT,
  width: THUMBNAIL_WIDTH,
})

const StyledTitleContainer = styled.View({
  flexDirection: 'row',
  marginBottom: getSpacing(5),
  alignItems: 'center',
})

const StyledMultiOfferList = styled(View)<{
  hasOnlyTwoOffers: boolean
}>(({ hasOnlyTwoOffers }) => ({
  marginLeft: getSpacing(10),
  justifyContent: hasOnlyTwoOffers ? 'flex-start' : 'space-between',
  height: '100%',
}))

const StyledSeparator = styled(Separator.Horizontal)<{
  hasOnlyTwoOffers: boolean
}>(({ hasOnlyTwoOffers }) => ({
  height: 2,
  marginVertical: hasOnlyTwoOffers ? getSpacing(6) : 0,
}))

const StyledHorizontalOfferTile = styled(HorizontalOfferTile)({
  marginVertical: 0,
})
