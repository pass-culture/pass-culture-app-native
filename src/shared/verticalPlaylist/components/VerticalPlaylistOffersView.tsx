import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { FlatList, Platform, useWindowDimensions } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { ArtistResponse } from 'api/gen'
import { Referrals, UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { OfferTileWrapper } from 'features/offer/components/OfferTile/OfferTileWrapper'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getGridTileRatio } from 'features/search/helpers/getGridTileRatio'
import { useGridListLayout, gridListLayoutActions } from 'features/search/store/gridListLayoutStore'
import { GridListLayout } from 'features/search/types'
import { analytics } from 'libs/analytics/provider'
import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { accessibilityRoleInternalNavigation } from 'shared/accessibility/helpers/accessibilityRoleInternalNavigation'
import { useGetHeaderHeight } from 'shared/header/useGetHeaderHeight'
import { NumberOfItems } from 'shared/NumberOfItems/NumberOfItems'
import { Offer } from 'shared/offer/types'
import { LineSeparator } from 'shared/verticalPlaylist/components/LineSeparator'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { Avatar } from 'ui/components/Avatar/Avatar'
import { DefaultAvatar } from 'ui/components/Avatar/DefaultAvatar'
import { GridLayoutButton } from 'ui/components/buttons/GridLayoutButton'
import { ListLayoutButton } from 'ui/components/buttons/ListLayoutButton'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { InfoHeader } from 'ui/components/InfoHeader/InfoHeader'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Page } from 'ui/pages/Page'
import { RightFilled } from 'ui/svg/icons/RightFilled'
import { RATIO_HOME_IMAGE, Spacer, Typo } from 'ui/theme'
import { AVATAR_SMALL } from 'ui/theme/constants'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const isWeb = Platform.OS === 'web'
const numColumns = 2

type Props = {
  title: string
  subtitle?: string
  items: Offer[]
  searchId?: string
  searchQuery?: string
  analyticsFrom: Referrals
  artist?: ArtistResponse
  moduleId?: string
}

export const VerticalPlaylistOffersView = ({
  title,
  subtitle,
  items,
  searchId,
  searchQuery,
  analyticsFrom,
  artist,
  moduleId,
}: Props) => {
  const { goBack } = useNavigation<UseNavigationType>()
  const { headerTransition, onScroll } = useOpacityTransition()
  const headerHeight = useGetHeaderHeight()
  const { width } = useWindowDimensions()
  const { searchState } = useSearch()
  const { designSystem, breakpoints, contentPage, isMobileViewport } = useTheme()

  const selectedGridListLayout = useGridListLayout()

  const canUseGrid = isMobileViewport && !isWeb
  const isGridLayout = canUseGrid && selectedGridListLayout === GridListLayout.GRID

  const nbHits = items.length

  const originDetails = artist ? 'artistRecommendation' : undefined
  const artistName = artist?.name

  const onGridListButtonPress = (layout: GridListLayout) => {
    if (!canUseGrid) return
    gridListLayoutActions.setLayout(layout)
    void analytics.logHasClickedGridListToggle({ fromLayout: selectedGridListLayout })
  }

  const getLayoutButtonProps = (layout: GridListLayout) => ({
    layout,
    isSelected: selectedGridListLayout === layout,
    onPress: () => onGridListButtonPress(layout),
  })

  const { tileWidth, nbrOfTilesToDisplay } = getGridTileRatio({
    screenWidth: width,
    margin: designSystem.size.spacing.xl,
    gutter: designSystem.size.spacing.l,
    breakpoint: breakpoints.lg,
  })

  const renderItem = useCallback(
    ({ item, index }: { item: Offer; index: number }) =>
      isGridLayout ? (
        <OfferTileWrapper
          item={item}
          analyticsFrom={analyticsFrom}
          height={tileWidth / RATIO_HOME_IMAGE}
          width={tileWidth}
          searchId={searchId}
          moduleId={moduleId}
          artistName={artistName}
          originDetails={originDetails}
          containerWidth={width / nbrOfTilesToDisplay - contentPage.marginHorizontal}
        />
      ) : (
        <HorizontalOfferTile
          offer={item}
          analyticsParams={{
            query: searchQuery ?? searchState.query,
            index,
            searchId,
            from: analyticsFrom,
            moduleId,
            artistName,
            originDetails,
          }}
        />
      ),
    [
      isGridLayout,
      tileWidth,
      width,
      nbrOfTilesToDisplay,
      contentPage.marginHorizontal,
      searchId,
      searchQuery,
      searchState.query,
      analyticsFrom,
      moduleId,
      artistName,
      originDetails,
    ]
  )

  const onArtistPress = (artistId: string, artistName: string) => {
    void analytics.logConsultArtist({
      artistId,
      artistName,
      from: analyticsFrom,
      originDetails: 'artistRecommendation',
    })
  }

  return (
    <Page>
      <FlatList
        data={items}
        keyExtractor={(item) => item.objectID}
        key={isGridLayout ? 'grid' : 'list'}
        renderItem={renderItem}
        numColumns={isGridLayout ? numColumns : undefined}
        ItemSeparatorComponent={isGridLayout ? GridSeparator : LineSeparator}
        ListHeaderComponent={
          <React.Fragment>
            <Placeholder height={headerHeight} />

            <Typo.Title2 {...getHeadingAttrs(1)}>{title}</Typo.Title2>
            {artist ? (
              <InternalTouchableLink
                navigateTo={{ screen: 'Artist', params: { id: artist.id } }}
                accessibilityLabel={`Accéder à la page artiste de ${artist.name}`}
                accessibilityRole={accessibilityRoleInternalNavigation()}
                onBeforeNavigate={() => onArtistPress(artist.id, artist.name)}>
                <StyledInfoHeader
                  title={artist.name}
                  subtitle="te partage ses pépites"
                  defaultThumbnailSize={AVATAR_SMALL}
                  thumbnailComponent={
                    <Avatar
                      size={AVATAR_SMALL}
                      rounded={false}
                      borderRadius={designSystem.size.borderRadius.pill}>
                      {artist.image ? (
                        <ArtistImage url={artist.image} testID="ArtistImage" />
                      ) : (
                        <DefaultAvatar testID="defaultArtistAvatar" />
                      )}
                    </Avatar>
                  }
                  rightComponent={
                    <RightFilled size={designSystem.size.icon.s} testID="RightFilled" />
                  }
                />
              </InternalTouchableLink>
            ) : null}
            {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
            <HeaderRow>
              <TitleContainer>
                <NumberOfItems nbItems={nbHits} type="offers" />
              </TitleContainer>
              {canUseGrid ? (
                <GridListMenu>
                  <ListLayoutButton {...getLayoutButtonProps(GridListLayout.LIST)} />
                  <GridLayoutButton {...getLayoutButtonProps(GridListLayout.GRID)} />
                </GridListMenu>
              ) : null}
            </HeaderRow>
          </React.Fragment>
        }
        ListFooterComponent={<Spacer.BottomScreen />}
        contentContainerStyle={{
          paddingHorizontal: contentPage.marginHorizontal,
          paddingVertical: contentPage.marginVertical,
        }}
        onScroll={onScroll}
      />

      {/* On native header is called after Body to implement the BlurView for iOS */}
      <ContentHeader headerTitle={title} onBackPress={goBack} headerTransition={headerTransition} />
    </Page>
  )
}

const Subtitle = styled(Typo.BodyAccentXs)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.m,
  color: theme.designSystem.color.text.subtle,
}))

const HeaderRow = styled.View(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: theme.designSystem.size.spacing.l,
  marginBottom: theme.designSystem.size.spacing.m,
}))

const GridListMenu = styled.View(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'flex-end',
  marginBottom: theme.designSystem.size.spacing.m,
}))

const GridSeparator = styled.View(({ theme }) => ({
  paddingBottom: theme.designSystem.size.spacing.l,
}))

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))

const TitleContainer = styled.View({
  justifyContent: 'center',
})

const StyledInfoHeader = styled(InfoHeader)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))

const ArtistImage = styled(FastImage)(({ theme }) => ({
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.designSystem.color.background.subtle,
  borderWidth: 1,
  borderColor: theme.designSystem.color.border.subtle,
}))
