import { useNavigation } from '@react-navigation/native'
import { ObservedList } from 'features/home/components/parsers/ObservedList'
import React, { useCallback, useEffect } from 'react'
import { Platform, StyleProp, ViewStyle, ViewToken } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { VenueMapLocationModal } from 'features/location/components/VenueMapLocationModal'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { SearchStackParamList } from 'features/navigation/SearchStackNavigator/SearchStackTypes'
import { NumberOfResults } from 'features/search/components/NumberOfResults/NumberOfResults'
import { SearchVenueItem } from 'features/search/components/SearchVenueItems/SearchVenueItem'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getVenueTypesFromSearchGroup } from 'features/search/helpers/getVenueTypesFromSearchGroup/getVenueTypesFromSearchGroup'
import { venuesFilterActions } from 'features/venueMap/store/venuesFilterStore'
import { AlgoliaVenue } from 'libs/algolia/types'
import { analytics } from 'libs/analytics/provider'
import { ContentfulLabelCategories } from 'libs/contentful/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'
import { setPlaylistTrackingInfo } from 'store/tracking/playlistTrackingStore'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { useModal } from 'ui/components/modals/useModal'
import { Playlist } from 'ui/components/Playlist'
import { Separator } from 'ui/components/Separator'
import { Map } from 'ui/svg/icons/Map'
import { LENGTH_XS, LENGTH_XXS, Typo } from 'ui/theme'

export const VENUE_ITEM_HEIGHT = LENGTH_XXS
export const VENUE_ITEM_WIDTH = LENGTH_XS
const keyExtractor = (item: AlgoliaVenue) => item.objectID

type Props = {
  venuePlaylistTitle: string
  venues: AlgoliaVenue[]
  isLocated?: boolean
  shouldDisplaySeparator?: boolean
  currentView?: keyof SearchStackParamList
  offerCategory?: SearchGroupNameEnumv2
  searchGroup?: SearchGroupNameEnumv2
  style?: StyleProp<ViewStyle>
}

const renderVenueItem = (
  {
    item,
    height,
    width,
  }: {
    item: AlgoliaVenue
    height: number
    width: number
  },
  searchId?: string,
  searchGroupLabel?: ContentfulLabelCategories
) => (
  <SearchVenueItem
    venue={item}
    height={height}
    width={width}
    searchId={searchId}
    searchGroupLabel={searchGroupLabel}
  />
)

const isWeb = Platform.OS === 'web'

export const VenuePlaylist: React.FC<Props> = ({
  venuePlaylistTitle,
  venues,
  isLocated = false,
  currentView = 'SearchResults',
  offerCategory,
  shouldDisplaySeparator = true,
  searchGroup,
  style,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const {
    searchState: { searchId },
  } = useSearch()
  const enabledVenueMap = useFeatureFlag(RemoteStoreFeatureFlags.WIP_VENUE_MAP)
  const { setVenuesFilters } = venuesFilterActions

  const logVenuePlaylistDisplayedOnSearchResultsOnce = useFunctionOnce(() =>
    analytics.logVenuePlaylistDisplayedOnSearchResults({
      searchId,
      isLocated,
      searchNbResults: venues?.length,
    })
  )

  useEffect(() => {
    if (currentView === 'SearchResults') logVenuePlaylistDisplayedOnSearchResultsOnce()
  }, [currentView, logVenuePlaylistDisplayedOnSearchResultsOnce])

  const logAllTilesSeenOnce = useFunctionOnce(() => analytics.logAllTilesSeen({ searchId }))

  const {
    showModal: showVenueMapLocationModal,
    visible: venueMapLocationModalVisible,
    hideModal: hideVenueMapLocationModal,
  } = useModal()

  const searchGroupLabelMapping = useSearchGroupLabelMapping()
  const searchGroupLabel = searchGroup
    ? (searchGroupLabelMapping[searchGroup] as ContentfulLabelCategories)
    : undefined

  const isMapWithoutPositionAndNotLocated = !isLocated && !isWeb

  const handleSeeMapPress = () => {
    setVenuesFilters(offerCategory ? getVenueTypesFromSearchGroup(offerCategory) : [])

    if (isMapWithoutPositionAndNotLocated) {
      showVenueMapLocationModal()
      return
    }

    analytics.logConsultVenueMap({ from: 'searchPlaylist' })
    navigate('VenueMap')
  }

  const onViewableItemsChanged = useCallback(
    (viewableItems: Pick<ViewToken, 'key' | 'index'>[]) => {
      setPlaylistTrackingInfo({
        index: viewableItems[0]?.index ?? 0,
        moduleId: 'moduleId',
        viewedAt: new Date(),
        items: viewableItems,
        itemType: 'venue',
      })
    },
    // Changing onViewableItemsChanged on the fly is not supported
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const shouldDisplaySeeOnMapButton = enabledVenueMap && currentView === 'ThematicSearch' && !isWeb

  return (
    <React.Fragment>
      <Container style={style}>
        <Typo.Title3 numberOfLines={isWeb ? 1 : undefined}>{venuePlaylistTitle}</Typo.Title3>
        {shouldDisplaySeeOnMapButton ? (
          <ButtonContainer>
            <ButtonTertiaryBlack
              icon={Map}
              wording="Voir sur la carte"
              onPress={handleSeeMapPress}
            />
          </ButtonContainer>
        ) : (
          <NumberOfResults nbHits={venues?.length ?? 0} />
        )}
        <ObservedList<FlatList> onViewableItemsChanged={onViewableItemsChanged}>
          {({ listRef, handleViewableItemsChanged }) => (
            <Playlist
              data={venues ?? []}
              scrollButtonOffsetY={VENUE_ITEM_HEIGHT / 2 + 4}
              itemHeight={VENUE_ITEM_HEIGHT}
              itemWidth={VENUE_ITEM_WIDTH}
              renderItem={({ item, height, width }) =>
                renderVenueItem({ item, height, width }, searchId, searchGroupLabel)
              }
              renderHeader={undefined}
              renderFooter={undefined}
              keyExtractor={keyExtractor}
              testID="search-venue-list"
              onEndReached={logAllTilesSeenOnce}
              onViewableItemsChanged={handleViewableItemsChanged}
              ref={listRef}
            />
          )}
        </ObservedList>
      </Container>
      {shouldDisplaySeparator ? <StyledSeparator testID="venue-playlist-separator" /> : null}
      <VenueMapLocationModal
        visible={venueMapLocationModalVisible}
        dismissModal={hideVenueMapLocationModal}
        openedFrom="searchPlaylist"
      />
    </React.Fragment>
  )
}

const Container = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xxl,
  marginHorizontal: theme.designSystem.size.spacing.xl,
}))

const StyledSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  width: 'auto',
  marginLeft: theme.designSystem.size.spacing.xl,
  marginRight: theme.designSystem.size.spacing.xl,
  marginTop: theme.designSystem.size.spacing.m,
}))

const ButtonContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xs,
  alignSelf: 'flex-start',
}))
