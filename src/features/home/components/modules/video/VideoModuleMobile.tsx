import colorAlpha from 'color-alpha'
import React, { FunctionComponent, useState } from 'react'
import { LayoutChangeEvent, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleTitle } from 'features/home/components/AccessibleTitle'
import { VideoMonoOfferTile } from 'features/home/components/modules/video/VideoMonoOfferTile'
import { VideoMultiOfferPlaylist } from 'features/home/components/modules/video/VideoMultiOfferPlaylist'
import { VideoModuleProps } from 'features/home/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useFontScaleValue } from 'shared/accessibility/useFontScaleValue'
import { ColorsType } from 'theme/types'
import { Play } from 'ui/svg/icons/Play'
import { getSpacing, Typo } from 'ui/theme'
import { videoModuleColorsMapping } from 'ui/theme/videoModuleColorsMapping'

const THUMBNAIL_HEIGHT = getSpacing(52.5)
// We do not center the player icon, because when the title is 2-line long,
// the title is to close to the player. So the player is closer to the top.
const PLAYER_SIZE = getSpacing(24)
const COLOR_CATEGORY_BACKGROUND_HEIGHT_MULTI_OFFER = getSpacing(38.5)

export const VideoModuleMobile: FunctionComponent<VideoModuleProps> = (props) => {
  const { designSystem } = useTheme()

  const numberOfLines = useFontScaleValue({ default: 1, at200PercentZoom: 3 })

  const [monoOfferCardHeight, setMonoOfferCardHeight] = useState<number>(0)
  const MONO_OFFER_CARD_VERTICAL_SPACING = designSystem.size.spacing.xxl

  const COLOR_CATEGORY_BACKGROUND_HEIGHT_MONO_OFFER =
    MONO_OFFER_CARD_VERTICAL_SPACING + monoOfferCardHeight

  const fillFromDesignSystem =
    designSystem.color.background[videoModuleColorsMapping[props.color] ?? 'default']

  return (
    <Container>
      <StyledTitleContainer>
        <AccessibleTitle
          title={props.title}
          accessibilityLabel={`Média vidéo\u00a0: ${props.title}`}
        />
      </StyledTitleContainer>
      {props.videoDescription ? (
        <Description>{props.videoDescription}</Description>
      ) : (
        <ViewWithPaddingTop />
      )}
      <View testID="mobile-video-module">
        <StyledTouchableHighlight
          onPress={props.showVideoModal}
          testID="video-thumbnail"
          accessibilityRole={AccessibilityRole.BUTTON}>
          <Thumbnail source={{ uri: props.videoThumbnail }}>
            <BlackView />
            <TextContainer>
              <VideoTitle numberOfLines={numberOfLines} ellipsizeMode="tail">
                {props.videoTitle}
              </VideoTitle>
            </TextContainer>
            <PlayerContainer>
              <Player />
            </PlayerContainer>
          </Thumbnail>
        </StyledTouchableHighlight>
        <ViewWithPaddingTop>
          {!props.isMultiOffer && props.offers[0] ? (
            <VideoOfferContainer
              onLayout={(event: LayoutChangeEvent) => {
                const { height } = event.nativeEvent.layout
                setMonoOfferCardHeight(height)
              }}>
              <VideoMonoOfferTileWrapper>
                <VideoMonoOfferTile
                  offer={props.offers[0]}
                  color={props.color}
                  hideModal={props.hideVideoModal}
                  analyticsParams={props.analyticsParams}
                />
              </VideoMonoOfferTileWrapper>
            </VideoOfferContainer>
          ) : (
            <VideoOfferContainer>
              <VideoMultiOfferPlaylist
                offers={props.offers}
                hideModal={props.hideVideoModal}
                analyticsParams={props.analyticsParams}
              />
            </VideoOfferContainer>
          )}
          <ColorCategoryBackground
            colorCategoryBackgroundHeightUniqueOffer={COLOR_CATEGORY_BACKGROUND_HEIGHT_MONO_OFFER}
            backgroundColor={fillFromDesignSystem || videoModuleColorsMapping[props.color]}
            isMultiOffer={props.isMultiOffer}
          />
        </ViewWithPaddingTop>
      </View>
    </Container>
  )
}

const ViewWithPaddingTop = styled.View(({ theme }) => ({
  paddingTop: theme.designSystem.size.spacing.l,
}))

const Container = styled.View(({ theme }) => ({
  paddingBottom: theme.home.spaceBetweenModules,
}))

const StyledTitleContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xs,
  alignItems: 'center',
  flexDirection: 'row',
}))

const StyledTouchableHighlight = styled.TouchableHighlight.attrs(({ theme }) => ({
  underlayColor: theme.designSystem.color.background.lockedInverted,
}))(({ theme }) => ({
  borderRadius: theme.designSystem.size.borderRadius.m,
}))

const Thumbnail = styled.ImageBackground({
  height: THUMBNAIL_HEIGHT,
  width: '100%',
})

const BlackView = styled.View(({ theme }) => ({
  backgroundColor: colorAlpha(theme.designSystem.color.background.lockedInverted, 0.6),
  height: THUMBNAIL_HEIGHT,
  justifyContent: 'center',
}))

const TextContainer = styled.View({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
})

const VideoTitle = styled(Typo.Title4)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
  textAlign: 'center',
  textTransform: 'uppercase',
  padding: theme.designSystem.size.spacing.l,
}))

const PlayerContainer = styled.View(({ theme }) => ({
  position: 'absolute',
  top: theme.designSystem.size.spacing.xxxxl,
  left: 0,
  right: 0,
  alignItems: 'center',
}))

const Player = styled(Play).attrs({
  size: PLAYER_SIZE,
  accessibilityLabel: 'Lire la vidéo',
})``

const ColorCategoryBackground = styled.View<{
  colorCategoryBackgroundHeightUniqueOffer: number
  isMultiOffer: boolean
  backgroundColor: ColorsType
}>(({ colorCategoryBackgroundHeightUniqueOffer, isMultiOffer, backgroundColor, theme }) => ({
  height: isMultiOffer
    ? COLOR_CATEGORY_BACKGROUND_HEIGHT_MULTI_OFFER
    : colorCategoryBackgroundHeightUniqueOffer,
  backgroundColor,
  position: 'absolute',
  width: '100%',
  zIndex: theme.zIndex.background,
}))

const VideoOfferContainer = styled.View(({ theme }) => ({
  overflow: 'visible',
  marginBottom: theme.designSystem.size.spacing.xxl,
}))

const VideoMonoOfferTileWrapper = styled.View(({ theme }) => ({
  flexGrow: 1,
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const Description = styled(Typo.BodyAccentXs)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
  marginHorizontal: theme.designSystem.size.spacing.xl,
  color: theme.designSystem.color.text.subtle,
}))
