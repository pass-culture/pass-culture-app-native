import React, { useCallback, useEffect } from 'react'
import { Platform, ViewToken } from 'react-native'
import { styled, useTheme } from 'styled-components/native'

import {
  HomepageModuleType,
  ModuleData,
  ArtistPlaylistModule as ArtistPlaylistModuleType,
} from 'features/home/types'
import { getSearchPropConfig } from 'features/navigation/navigators/SearchStackNavigator/getSearchPropConfig'
import { OfferTileWrapper } from 'features/offer/components/OfferTile/OfferTileWrapper'
import { useAdaptOffersPlaylistParameters } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/useAdaptOffersPlaylistParameters'
import { analytics } from 'libs/analytics/provider'
import { getPlaylistItemDimensionsFromLayout } from 'libs/contentful/getPlaylistItemDimensionsFromLayout'
import { ContentTypes } from 'libs/contentful/types'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { useArtistQuery } from 'queries/artist/useArtistQuery'
import { accessibilityRoleInternalNavigation } from 'shared/accessibility/helpers/accessibilityRoleInternalNavigation'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'
import { Offer } from 'shared/offer/types'
import { VerticalPlaylist } from 'shared/verticalPlaylist/enums'
import { Avatar } from 'ui/components/Avatar/Avatar'
import { DefaultAvatar } from 'ui/components/Avatar/DefaultAvatar'
import { InfoHeader } from 'ui/components/InfoHeader/InfoHeader'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem } from 'ui/components/Playlist'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { RightFilled } from 'ui/svg/icons/RightFilled'
import { AVATAR_SMALL } from 'ui/theme/constants'

const isWeb = Platform.OS === 'web'

export type ArtistPlaylistModuleProps = {
  offersModuleParameters: ArtistPlaylistModuleType['offersModuleParameters']
  displayParameters: ArtistPlaylistModuleType['displayParameters']
  artistId: ArtistPlaylistModuleType['artistId']
  moduleId: string
  index: number
  homeEntryId: string | undefined
  data: ModuleData | undefined
  onViewableItemsChanged?: (items: Pick<ViewToken, 'key' | 'index'>[]) => void
}

const keyExtractor = (item: Offer) => item.objectID

export const ArtistPlaylistModule = (props: ArtistPlaylistModuleProps) => {
  const {
    displayParameters,
    offersModuleParameters,
    artistId,
    index,
    moduleId,
    homeEntryId,
    data,
    onViewableItemsChanged,
  } = props
  const { designSystem } = useTheme()
  const adaptedPlaylistParameters = useAdaptOffersPlaylistParameters()
  const { data: artist } = useArtistQuery(artistId)

  const { playlistItems } = data ?? { playlistItems: [] }

  const [parameters = { title: '', hitsPerPage: 0 }] = offersModuleParameters
  // When we navigate to the search page, we want to show 20 results per page,
  // not what is configured in contentful

  const { offerParams, locationParams } = adaptedPlaylistParameters(parameters)
  const searchParams = {
    ...offerParams,
    locationParams,
    hitsPerPage: 20,
  }
  const searchTabConfig = getSearchPropConfig('SearchResults', searchParams)

  const moduleName = displayParameters.title ?? parameters?.title

  const logHasSeenAllTilesOnce = useFunctionOnce(() =>
    analytics.logAllTilesSeen({
      moduleName,
      numberOfTiles: playlistItems.length,
      apiRecoParams: undefined,
    })
  )

  const onBeforeNavigate = () =>
    analytics.logClickSeeAll({ type: 'offers', moduleName, moduleId, from: 'home' })

  const renderItem: CustomListRenderItem<Offer> = useCallback(
    ({ item, width, height }) => {
      return (
        <OfferTileWrapper
          item={item}
          moduleName={moduleName}
          moduleId={moduleId}
          homeEntryId={homeEntryId}
          artistName={artist?.name}
          originDetails="artistRecommendation"
          width={width}
          height={height}
          analyticsFrom="home"
          hasSmallLayout
        />
      )
    },

    [moduleName, moduleId, homeEntryId, artist?.name]
  )

  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout('three-items')

  const shouldModuleBeDisplayed =
    playlistItems.length > 0 && playlistItems.length >= displayParameters.minOffers && artist

  useEffect(() => {
    if (shouldModuleBeDisplayed) {
      void analytics.logModuleDisplayedOnHomepage({
        moduleId,
        moduleType: ContentTypes.ARTIST_PLAYLIST,
        index,
        homeEntryId,
        offers: (playlistItems as Offer[]).map((item) => item.objectID),
      })
    }
  }, [homeEntryId, index, moduleId, playlistItems, shouldModuleBeDisplayed])

  if (!shouldModuleBeDisplayed) return null

  const navigateToVerticalPlaylist = {
    screen: 'VerticalPlaylistOffers' as const,
    params: {
      type: VerticalPlaylist.ModuleArtistPlaylist,
      module: {
        id: moduleId,
        type: HomepageModuleType.ArtistPlaylistModule,
        title: moduleName,
        offersModuleParameters,
        displayParameters,
        artistId,
      },
    },
  }

  const onArtistPress = (artistId: string, artistName: string) => {
    void analytics.logConsultArtist({
      artistId,
      artistName,
      from: 'home',
      originDetails: 'artistRecommendation',
    })
  }

  return (
    <ObservedPlaylist onViewableItemsChanged={onViewableItemsChanged}>
      {({ listRef, handleViewableItemsChanged }) => (
        <PassPlaylist
          title={displayParameters.title}
          data={playlistItems}
          itemHeight={itemHeight}
          itemWidth={itemWidth}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReached={logHasSeenAllTilesOnce}
          playlistRef={listRef}
          onViewableItemsChanged={handleViewableItemsChanged}
          contentContainerStyle={{ paddingHorizontal: designSystem.size.spacing.xl }}
          seeAllButton={{
            onBeforeNavigate,
            navigateToVerticalPlaylist,
            navigateToSearchPlaylist: searchTabConfig,
            hideSearchSeeAll: isWeb,
          }}
          playlistHeader={
            artist ? (
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
            ) : undefined
          }
        />
      )}
    </ObservedPlaylist>
  )
}

const ArtistImage = styled(FastImage)(({ theme }) => ({
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.designSystem.color.background.subtle,
  borderWidth: 1,
  borderColor: theme.designSystem.color.border.subtle,
}))

const StyledInfoHeader = styled(InfoHeader)(({ theme }) => ({
  marginLeft: theme.designSystem.size.spacing.xl,
}))
