import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
// eslint-disable-next-line no-restricted-imports
import { ImageBackground, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleTitle } from 'features/home/components/AccessibleTitle'
import { AttachedThematicCard } from 'features/home/components/AttachedModuleCard/AttachedThematicCard'
import { VideoMonoOfferTile } from 'features/home/components/modules/video/VideoMonoOfferTile'
import { VideoModuleProps } from 'features/home/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { accessibilityRoleInternalNavigation } from 'shared/accessibility/helpers/accessibilityRoleInternalNavigation'
import { getComputedAccessibilityLabel } from 'shared/accessibility/helpers/getComputedAccessibilityLabel'
import { Offer } from 'shared/offer/types'
import { ColorsType } from 'theme/types'
import { Separator } from 'ui/components/Separator'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Play } from 'ui/svg/icons/Play'
import { getSpacing, Typo } from 'ui/theme'
import { videoModuleColorsMapping } from 'ui/theme/videoModuleColorsMapping'

const PLAYER_SIZE = getSpacing(24)
const THUMBNAIL_HEIGHT = getSpacing(93.5)
const THUMBNAIL_WIDTH = getSpacing(150)
const COLOR_CATEGORY_BACKGROUND_HEIGHT = getSpacing(55.5)
const COLOR_CATEGORY_BACKGROUND_WIDTH = getSpacing(160)

export const VideoModuleDesktop: FunctionComponent<VideoModuleProps> = (props) => {
  const { designSystem } = useTheme()
  const hasOnlyTwoOffers = props.offers.length === 2
  const nbOfSeparators = hasOnlyTwoOffers ? 1 : 2

  function renderSoloOffer() {
    return props.offers[0] ? (
      <VideoMonoOfferTileWrapper>
        <VideoMonoOfferTile
          offer={props.offers[0]}
          color={props.color}
          analyticsParams={props.analyticsParams}
        />
      </VideoMonoOfferTileWrapper>
    ) : null
  }

  function renderMultiOffer() {
    return (
      <StyledMultiOfferList hasOnlyTwoOffers={hasOnlyTwoOffers}>
        {props.offers.slice(0, 3).map((offer: Offer, index) => (
          <React.Fragment key={offer.objectID}>
            <StyledHorizontalOfferTile offer={offer} analyticsParams={props.analyticsParams} />
            {index < nbOfSeparators ? (
              <StyledSeparator hasOnlyTwoOffers={hasOnlyTwoOffers} />
            ) : null}
          </React.Fragment>
        ))}
      </StyledMultiOfferList>
    )
  }

  const fillFromDesignSystem =
    designSystem.color.background[videoModuleColorsMapping[props.color] ?? 'default']

  const hasThematicHomeEntry = !!(props.thematicHomeEntryId && props.thematicHomeTitle)

  return (
    <React.Fragment>
      <StyledTitleContainer>
        <AccessibleTitle
          title={props.title}
          accessibilityLabel={`Média vidéo\u00a0: ${props.title}`}
        />
      </StyledTitleContainer>
      <Description>{props.videoDescription}</Description>
      <View testID="desktop-video-module">
        <ColorCategoryBackgroundWrapper>
          <ColorCategoryBackground
            backgroundColor={fillFromDesignSystem || videoModuleColorsMapping[props.color]}
            isMultiOffer={props.isMultiOffer}
          />
        </ColorCategoryBackgroundWrapper>
        <VideoOfferContainer
          isMultiOffer={props.isMultiOffer}
          hasThematicHomeEntry={hasThematicHomeEntry}>
          <StyledTouchableHighlight
            onPress={props.onVideoPlaceholderPress}
            testID="video-thumbnail"
            accessibilityRole={AccessibilityRole.BUTTON}
            accessibilityLabel={`Ouvrir la page et lire la vidéo ${props.videoTitle}. Transcription disponible.`}>
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
          {hasThematicHomeEntry ? (
            <StyledView>
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
            </StyledView>
          ) : (
            <StyledView>{props.isMultiOffer ? renderMultiOffer() : renderSoloOffer()}</StyledView>
          )}
        </VideoOfferContainer>
      </View>
    </React.Fragment>
  )
}

const VideoMonoOfferTileWrapper = styled(View)(({ theme }) => ({
  flexGrow: 1,
  marginHorizontal: theme.designSystem.size.spacing.xxl,
  justifyContent: 'center',
}))

const StyledView = styled.View({
  flex: 1,
})

const BlackView = styled.View(({ theme }) => ({
  backgroundColor: colorAlpha(theme.designSystem.color.background.lockedInverted, 0.6),
  height: THUMBNAIL_HEIGHT,
  justifyContent: 'center',
}))

const VideoOfferContainer = styled.View<{
  isMultiOffer: boolean
  hasThematicHomeEntry: boolean
}>(({ theme, isMultiOffer, hasThematicHomeEntry }) => ({
  ...(isMultiOffer && !hasThematicHomeEntry
    ? { marginHorizontal: theme.contentPage.marginHorizontal }
    : { marginLeft: theme.contentPage.marginHorizontal }),
  flexDirection: 'row',
  height: '100%',
}))

const Thumbnail = styled(ImageBackground)(({ theme }) => ({
  // the overflow: hidden allow to add border radius to the image
  // https://stackoverflow.com/questions/49442165/how-do-you-add-borderradius-to-imagebackground/57616397
  overflow: 'hidden',
  borderRadius: theme.designSystem.size.borderRadius.m,
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
  backgroundColor: ColorsType
}>(({ isMultiOffer, backgroundColor }) => ({
  height: COLOR_CATEGORY_BACKGROUND_HEIGHT,
  width: isMultiOffer ? COLOR_CATEGORY_BACKGROUND_WIDTH : '100%',
  backgroundColor,
}))

const Player = styled(Play).attrs({
  size: PLAYER_SIZE,
  accessibilityLabel: 'Lire la vidéo',
})``

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

const StyledTouchableHighlight = styled.TouchableHighlight.attrs(({ theme }) => ({
  underlayColor: theme.designSystem.color.background.lockedInverted,
}))({
  height: THUMBNAIL_HEIGHT,
  width: THUMBNAIL_WIDTH,
})

const StyledTitleContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xs,
  alignItems: 'center',
  flexDirection: 'row',
}))

const StyledMultiOfferList = styled(View)<{
  hasOnlyTwoOffers: boolean
}>(({ hasOnlyTwoOffers, theme }) => ({
  marginLeft: theme.designSystem.size.spacing.xxxl,
  justifyContent: hasOnlyTwoOffers ? 'flex-start' : 'space-between',
  height: '100%',
}))

const StyledSeparator = styled(Separator.Horizontal)<{
  hasOnlyTwoOffers: boolean
}>(({ hasOnlyTwoOffers, theme }) => ({
  height: 2,
  marginVertical: hasOnlyTwoOffers ? theme.designSystem.size.spacing.xl : 0,
}))

const StyledHorizontalOfferTile = styled(HorizontalOfferTile)({
  marginVertical: 0,
})

const Description = styled(Typo.BodyAccentXs)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
  marginHorizontal: theme.designSystem.size.spacing.xl,
  color: theme.designSystem.color.text.subtle,
}))
