import colorAlpha from 'color-alpha'
import React, { FunctionComponent, useState } from 'react'
import { LayoutChangeEvent, View } from 'react-native'
import styled from 'styled-components/native'

import { VideoMonoOfferTile } from 'features/home/components/modules/video/VideoMonoOfferTile'
import { VideoMultiOfferPlaylist } from 'features/home/components/modules/video/VideoMultiOfferPlaylist'
import { VideoModuleProps } from 'features/home/types'
import { Play } from 'ui/svg/icons/Play'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { videoModuleColorsMapping } from 'ui/theme/videoModuleColorsMapping'

const THUMBNAIL_HEIGHT = getSpacing(52.5)
// We do not center the player icon, because when the title is 2-line long,
// the title is to close to the player. So the player is closer to the top.
const PLAYER_TOP_MARGIN = getSpacing(12.5)
const PLAYER_SIZE = getSpacing(24)
const COLOR_CATEGORY_BACKGROUND_HEIGHT_MULTI_OFFER = getSpacing(38.5)
const MONO_OFFER_CARD_VERTICAL_SPACING = getSpacing(8)

export const VideoModuleMobile: FunctionComponent<VideoModuleProps> = (props) => {
  const [monoOfferCardHeight, setMonoOfferCardHeight] = useState<number>(0)

  const COLOR_CATEGORY_BACKGROUND_HEIGHT_MONO_OFFER =
    MONO_OFFER_CARD_VERTICAL_SPACING + monoOfferCardHeight

  return (
    <Container>
      <StyledTitleContainer>
        <StyledTitleComponent>{props.title}</StyledTitleComponent>
      </StyledTitleContainer>
      <Spacer.Column numberOfSpaces={5} />

      <View testID="mobile-video-module">
        <StyledTouchableHighlight
          onPress={props.showVideoModal}
          testID="video-thumbnail"
          accessibilityRole="button">
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
        <View>
          <Spacer.Column numberOfSpaces={4} />
          {props.isMultiOffer ? (
            <VideoOfferContainer>
              <VideoMultiOfferPlaylist
                offers={props.offers}
                hideModal={props.hideVideoModal}
                analyticsParams={props.analyticsParams}
                homeEntryId={props.homeEntryId}
              />
            </VideoOfferContainer>
          ) : (
            <VideoOfferContainer
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
              />
            </VideoOfferContainer>
          )}
          <ColorCategoryBackground
            colorCategoryBackgroundHeightUniqueOffer={COLOR_CATEGORY_BACKGROUND_HEIGHT_MONO_OFFER}
            backgroundColor={videoModuleColorsMapping[props.color]}
            isMultiOffer={props.isMultiOffer}
          />
        </View>
      </View>
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  paddingBottom: theme.home.spaceBetweenModules,
}))

const StyledTitleContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const StyledTitleComponent = styled(TypoDS.Title3).attrs({
  numberOfLines: 2,
})({})

const StyledTouchableHighlight = styled.TouchableHighlight.attrs(({ theme }) => ({
  underlayColor: theme.colors.white,
}))(({ theme }) => ({
  borderRadius: theme.borderRadius.radius,
}))

const Thumbnail = styled.ImageBackground({
  height: THUMBNAIL_HEIGHT,
  width: '100%',
})

const BlackView = styled.View(({ theme }) => ({
  backgroundColor: colorAlpha(theme.colors.black, 0.6),
  height: THUMBNAIL_HEIGHT,
  justifyContent: 'center',
}))

const TextContainer = styled.View({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
})

const VideoTitle = styled(TypoDS.Title3)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
  textTransform: 'uppercase',
  fontSize: getSpacing(6.5),
  padding: getSpacing(4),
}))

const PlayerContainer = styled.View({
  position: 'absolute',
  top: PLAYER_TOP_MARGIN,
  left: 0,
  right: 0,
  alignItems: 'center',
})

const Player = styled(Play).attrs(({ theme }) => ({
  size: PLAYER_SIZE,
  color: theme.colors.brownLight,
}))({})

const ColorCategoryBackground = styled.View<{
  colorCategoryBackgroundHeightUniqueOffer: number
  isMultiOffer: boolean
  backgroundColor: ColorsEnum
}>(({ colorCategoryBackgroundHeightUniqueOffer, isMultiOffer, backgroundColor, theme }) => ({
  height: isMultiOffer
    ? COLOR_CATEGORY_BACKGROUND_HEIGHT_MULTI_OFFER
    : colorCategoryBackgroundHeightUniqueOffer,
  backgroundColor,
  position: 'absolute',
  width: '100%',
  zIndex: theme.zIndex.background,
}))

const VideoOfferContainer = styled.View({
  marginBottom: getSpacing(8),
})

const StyledVideoMonoOfferTile = styled(VideoMonoOfferTile)(({ theme }) => ({
  flexGrow: 1,
  marginHorizontal: theme.contentPage.marginHorizontal,
}))
