import colorAlpha from 'color-alpha'
import React, { FunctionComponent, useMemo } from 'react'
// eslint-disable-next-line no-restricted-imports
import { ImageBackground, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { AccessibleTitle } from 'features/home/components/AccessibleTitle'
import { BlackCaption } from 'features/home/components/BlackCaption'
import { BlackGradient } from 'features/home/components/BlackGradient'
import { TEXT_BACKGROUND_OPACITY } from 'features/home/components/constants'
import { VideoMonoOfferTile } from 'features/home/components/modules/video/VideoMonoOfferTile'
import { VideoModuleProps } from 'features/home/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { Offer } from 'shared/offer/types'
import { SeeMoreWithEye } from 'ui/components/SeeMoreWithEye'
import { Separator } from 'ui/components/Separator'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'
import { Play } from 'ui/svg/icons/Play'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { gradientColorsMapping } from 'ui/theme/gradientColorsMapping'

const THUMBNAIL_HEIGHT_MULTI_OFFER = getSpacing(90)
const THUMBNAIL_HEIGHT_MONO_OFFER = getSpacing(45)
const THUMBNAIL_WIDTH_MULTI_OFFER = getSpacing(132)
const THUMBNAIL_WIDTH_MONO_OFFER = getSpacing(82)
// We do not center the player icon for mono offer, because when the title is 2-line long,
// the title is to close to the player. So the player is closer to the top.
const PLAYER_TOP_MARGIN = getSpacing(12.5)
const PLAYER_SIZE = getSpacing(14.5)

const GRADIENT_HEIGHT = getSpacing(33)

export const OldVideoModuleDesktop: FunctionComponent<VideoModuleProps> = (props) => {
  const videoDuration = useMemo(() => `${props.durationInMinutes} min`, [props.durationInMinutes])

  const showSeeMore = props.offers.length > 3
  const hasOnlyTwoOffers = props.offers.length === 2
  const nbOfSeparators = hasOnlyTwoOffers ? 1 : 2

  function renderTitleSeeMore() {
    return showSeeMore && props.isMultiOffer ? (
      <SeeMoreWithEye title={props.videoTitle} onPressSeeMore={props.showVideoModal} />
    ) : null
  }

  return (
    <React.Fragment>
      <StyledTitleContainer>
        <AccessibleTitle testID="playlistTitle" title={props.title} />
        {renderTitleSeeMore()}
      </StyledTitleContainer>

      <StyledWrapper isMultiOffer={props.isMultiOffer} testID="desktop-video-module">
        <ColorCategoryBackground
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={gradientColorsMapping[props.color]}
          isMultiOffer={props.isMultiOffer}
        />
        <VideoOfferContainer>
          <StyledTouchableHighlight
            onPress={props.showVideoModal}
            testID="video-thumbnail"
            accessibilityRole={AccessibilityRole.BUTTON}
            isMultiOffer={props.isMultiOffer}>
            <Thumbnail source={{ uri: props.videoThumbnail }}>
              <DurationCaption label={videoDuration} />
              <TextContainer>
                <BlackGradient />
                <BlackBackground>
                  <VideoTitle numberOfLines={2}>{props.videoTitle}</VideoTitle>
                </BlackBackground>
              </TextContainer>
              <PlayerContainer isMultiOffer={props.isMultiOffer}>
                <Player />
              </PlayerContainer>
            </Thumbnail>
          </StyledTouchableHighlight>

          <Spacer.Row numberOfSpaces={4} />
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
            <StyledVideoMonoOfferTile
              // @ts-expect-error: because of noUncheckedIndexedAccess
              offer={props.offers[0]}
              color={props.color}
              hideModal={props.hideVideoModal}
              analyticsParams={props.analyticsParams}
              homeEntryId={props.homeEntryId}
            />
          )}
        </VideoOfferContainer>
      </StyledWrapper>
    </React.Fragment>
  )
}

const StyledWrapper = styled(View)<{
  isMultiOffer: boolean
}>(({ isMultiOffer }) => ({
  height:
    (isMultiOffer ? THUMBNAIL_HEIGHT_MULTI_OFFER : THUMBNAIL_HEIGHT_MONO_OFFER) + getSpacing(6),
}))

const VideoOfferContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  flexDirection: 'row',
  height: '100%',
}))

const Thumbnail = styled(ImageBackground)(({ theme }) => ({
  // the overflow: hidden allow to add border radius to the image
  // https://stackoverflow.com/questions/49442165/how-do-you-add-borderradius-to-imagebackground/57616397
  overflow: 'hidden',
  borderRadius: theme.borderRadius.radius,
  flex: 1,
  border: 1,
  borderColor: theme.colors.greyMedium,
  backgroundColor: theme.colors.greyLight,
}))

const DurationCaption = styled(BlackCaption)({
  position: 'absolute',
  top: getSpacing(2),
  right: getSpacing(2),
})

const PlayerContainer = styled(View)<{
  isMultiOffer: boolean
}>(({ isMultiOffer }) => ({
  ...(isMultiOffer
    ? {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }
    : { position: 'absolute', top: PLAYER_TOP_MARGIN, left: 0, right: 0, alignItems: 'center' }),
}))

const ColorCategoryBackground = styled(LinearGradient)<{
  isMultiOffer: boolean
}>(({ isMultiOffer }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  height: GRADIENT_HEIGHT,
  ...(isMultiOffer
    ? {
        width: getSpacing(144),
        borderTopRightRadius: getSpacing(4),
        borderBottomRightRadius: getSpacing(4),
      }
    : {
        right: 0,
      }),
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
}))<{ isMultiOffer: boolean }>(({ theme, isMultiOffer }) => ({
  borderRadius: theme.borderRadius.radius,
  height: isMultiOffer ? THUMBNAIL_HEIGHT_MULTI_OFFER : THUMBNAIL_HEIGHT_MONO_OFFER,
  width: isMultiOffer ? THUMBNAIL_WIDTH_MULTI_OFFER : THUMBNAIL_WIDTH_MONO_OFFER,
}))

const StyledTitleContainer = styled.View({
  flexDirection: 'row',
  marginBottom: getSpacing(5),
  alignItems: 'center',
})

const StyledVideoMonoOfferTile = styled(VideoMonoOfferTile)({
  flex: 1,
  flexGrow: 1,
})

const StyledMultiOfferList = styled(View)<{
  hasOnlyTwoOffers: boolean
}>(({ hasOnlyTwoOffers }) => ({
  flex: 1,
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
