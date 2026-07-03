import colorAlpha from 'color-alpha'
import React, { FunctionComponent, useState } from 'react'
import { LayoutChangeEvent, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleTitle } from 'features/home/components/AccessibleTitle'
import { AttachedThematicCard } from 'features/home/components/AttachedModuleCard/AttachedThematicCard'
import { VideoMonoOfferTile } from 'features/home/components/modules/video/VideoMonoOfferTile'
import { VideoMultiOfferPlaylist } from 'features/home/components/modules/video/VideoMultiOfferPlaylist'
import { VideoModuleProps } from 'features/home/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/analytics/provider'
import { accessibilityRoleInternalNavigation } from 'shared/accessibility/helpers/accessibilityRoleInternalNavigation'
import { getComputedAccessibilityLabel } from 'shared/accessibility/helpers/getComputedAccessibilityLabel'
import { useMobileFontScaleToDisplay } from 'shared/accessibility/helpers/zoomHelpers'
import { ColorsType } from 'theme/types'
import { SeeAllButton } from 'ui/components/SeeAllButton/SeeAllButton'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { Play } from 'ui/svg/icons/Play'
import { getSpacing, Typo } from 'ui/theme'
import { videoModuleColorsMapping } from 'ui/theme/videoModuleColorsMapping'

const THUMBNAIL_HEIGHT = getSpacing(52.5)
// We do not center the player icon, because when the title is 2-line long,
// the title is to close to the player. So the player is closer to the top.
const PLAYER_SIZE = getSpacing(24)
const COLOR_CATEGORY_BACKGROUND_HEIGHT_MULTI_OFFER = getSpacing(38.5)

interface VideoModuleMobileProps extends VideoModuleProps {
  navigateToVideoModulePage?: InternalNavigationProps['navigateTo']
}

export const VideoModuleMobile: FunctionComponent<VideoModuleMobileProps> = (props) => {
  const { designSystem } = useTheme()

  const numberOfLines = useMobileFontScaleToDisplay({ default: 1, at200PercentZoom: 3 })
  const [monoOfferCardHeight, setMonoOfferCardHeight] = useState<number>(0)
  const MONO_OFFER_CARD_VERTICAL_SPACING = designSystem.size.spacing.xxl
  const COLOR_CATEGORY_BACKGROUND_HEIGHT_MONO_OFFER =
    MONO_OFFER_CARD_VERTICAL_SPACING + monoOfferCardHeight

  const hasThematicHomeEntry = !!(props.thematicHomeEntryId && props.thematicHomeTitle)
  const fillFromDesignSystem =
    designSystem.color.background[videoModuleColorsMapping[props.color] ?? 'default']

  const onBeforeNavigate = () => {
    void analytics.logClickSeeAll({
      type: 'offers',
      moduleId: props.id,
      moduleName: props.title,
      from: 'home',
    })
  }

  function renderTitleSeeMore() {
    return props.offers.length > 3 && props.isMultiOffer ? (
      <SeeAllButtonContainer withMargin>
        <SeeAllButton
          playlistTitle={props.videoTitle}
          data={{
            onBeforeNavigate,
            navigateToVerticalPlaylist: props.navigateToVideoModulePage,
            hideSearchSeeAll: true,
          }}
        />
      </SeeAllButtonContainer>
    ) : null
  }

  const renderOfferPart = () => {
    if (!props.isMultiOffer && props.offers[0]) {
      return (
        <VideoOfferContainer
          onLayout={(event: LayoutChangeEvent) => {
            const { height } = event.nativeEvent.layout
            setMonoOfferCardHeight(height)
          }}>
          <VideoMonoOfferTileWrapper>
            <VideoMonoOfferTile
              offer={props.offers[0]}
              color={props.color}
              analyticsParams={props.analyticsParams}
            />
          </VideoMonoOfferTileWrapper>
        </VideoOfferContainer>
      )
    }

    return (
      <VideoOfferContainer>
        <VideoMultiOfferPlaylist offers={props.offers} analyticsParams={props.analyticsParams} />
      </VideoOfferContainer>
    )
  }

  return (
    <Container>
      <StyledTitleContainer>
        <AccessibleTitle
          title={props.title}
          accessibilityLabel={`Média vidéo\u00a0: ${props.title}`}
        />
        {renderTitleSeeMore()}
      </StyledTitleContainer>
      {props.videoDescription ? (
        <Description>{props.videoDescription}</Description>
      ) : (
        <ViewWithPaddingTop />
      )}
      <View testID="mobile-video-module">
        <StyledTouchableHighlight
          onPress={props.onVideoPlaceholderPress}
          testID="video-thumbnail"
          accessibilityRole={AccessibilityRole.BUTTON}
          accessibilityLabel={`Ouvrir la page et lire la vidéo ${props.videoTitle}. Transcription disponible.`}>
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
          {hasThematicHomeEntry ? (
            <VideoOfferContainer
              onLayout={(event: LayoutChangeEvent) => {
                const { height } = event.nativeEvent.layout
                setMonoOfferCardHeight(height)
              }}>
              <VideoMonoOfferTileWrapper>
                <InternalTouchableLink
                  navigateTo={{
                    screen: 'ThematicHome',
                    params: {
                      homeId: props.thematicHomeEntryId,
                      from: 'videoModule',
                      moduleId: props.id,
                    },
                  }}
                  accessibilityLabel={getComputedAccessibilityLabel(props.thematicHomeTitle)}
                  accessibilityRole={accessibilityRoleInternalNavigation()}>
                  <AttachedThematicCard title={props.thematicHomeTitle ?? ''} />
                </InternalTouchableLink>
              </VideoMonoOfferTileWrapper>
            </VideoOfferContainer>
          ) : (
            renderOfferPart()
          )}
          <ColorCategoryBackground
            colorCategoryBackgroundHeightUniqueOffer={COLOR_CATEGORY_BACKGROUND_HEIGHT_MONO_OFFER}
            backgroundColor={fillFromDesignSystem || videoModuleColorsMapping[props.color]}
            isMultiOffer={props.isMultiOffer}
            hasThematicHomeEntry={hasThematicHomeEntry}
          />
        </ViewWithPaddingTop>
      </View>
    </Container>
  )
}

const SeeAllButtonContainer = styled.View<{ withMargin?: boolean }>(({ withMargin, theme }) => ({
  marginRight: withMargin ? theme.contentPage.marginHorizontal : undefined,
  justifyContent: 'center',
}))

const ViewWithPaddingTop = styled.View(({ theme }) => ({
  paddingTop: theme.designSystem.size.spacing.l,
}))

const Container = styled.View(({ theme }) => ({
  paddingBottom: theme.home.spaceBetweenModules,
}))

const StyledTitleContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xs,
  alignItems: 'center',
  justifyContent: 'space-between',
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
  hasThematicHomeEntry: boolean
}>(
  ({
    colorCategoryBackgroundHeightUniqueOffer,
    isMultiOffer,
    backgroundColor,
    hasThematicHomeEntry,
    theme,
  }) => ({
    height:
      isMultiOffer && !hasThematicHomeEntry
        ? COLOR_CATEGORY_BACKGROUND_HEIGHT_MULTI_OFFER
        : colorCategoryBackgroundHeightUniqueOffer,
    backgroundColor,
    position: 'absolute',
    width: '100%',
    zIndex: theme.zIndex.background,
  })
)

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
