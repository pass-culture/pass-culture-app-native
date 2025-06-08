import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { Platform, StyleProp, ViewStyle } from 'react-native'
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
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { useModal } from 'ui/components/modals/useModal'
import { Playlist } from 'ui/components/Playlist'
import { Separator } from 'ui/components/Separator'
import { Map } from 'ui/svg/icons/Map'
import { getSpacing, LENGTH_XS, LENGTH_XXS, Typo } from 'ui/theme'

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

  const shouldDisplaySeeOnMapButton = enabledVenueMap && currentView === 'ThematicSearch' && !isWeb

  return (
    <React.Fragment>
      <Container style={style}>
        <Title numberOfLines={isWeb ? 1 : undefined}>{venuePlaylistTitle}</Title>
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
        />
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

const Title = styled(Typo.Title3)({
  marginHorizontal: getSpacing(6),
})

const StyledSeparator = styled(Separator.Horizontal)({
  width: 'auto',
  marginLeft: getSpacing(6),
  marginRight: getSpacing(6),
  marginTop: getSpacing(3),
})

const ButtonContainer = styled.View({
  marginLeft: getSpacing(6),
  marginTop: getSpacing(1),
  alignSelf: 'flex-start',
})

const Container = styled.View({
  marginBottom: getSpacing(8),
})
