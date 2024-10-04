import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { SearchStackParamList } from 'features/navigation/SearchStackNavigator/types'
import { NumberOfResults } from 'features/search/components/NumberOfResults/NumberOfResults'
import { SearchVenueItem } from 'features/search/components/SearchVenueItems/SearchVenueItem'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useShouldDisplayVenueMap } from 'features/venueMap/hook/useShouldDisplayVenueMap'
import { useInitialVenuesActions } from 'features/venueMap/store/initialVenuesStore'
import { adaptAlgoliaVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/adaptAlgoliaVenues'
import { AlgoliaVenue } from 'libs/algolia/types'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Playlist } from 'ui/components/Playlist'
import { Separator } from 'ui/components/Separator'
import { Map } from 'ui/svg/icons/Map'
import { getSpacing, LENGTH_XS, LENGTH_XXS, Spacer, TypoDS } from 'ui/theme'

const VENUE_ITEM_HEIGHT = LENGTH_XXS
const VENUE_ITEM_WIDTH = LENGTH_XS
const keyExtractor = (item: AlgoliaVenue) => item.objectID

type Props = {
  venuePlaylistTitle: string
  venues: AlgoliaVenue[]
  isLocated?: boolean
  currentView?: keyof SearchStackParamList
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
  searchId?: string
) => <SearchVenueItem venue={item} height={height} width={width} searchId={searchId} />

export const VenuePlaylist: React.FC<Props> = ({
  venuePlaylistTitle,
  venues,
  isLocated = false,
  currentView = 'SearchResults',
}) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { setInitialVenues } = useInitialVenuesActions()
  const {
    searchState: { searchId },
  } = useSearch()

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

  const { shouldDisplayVenueMap } = useShouldDisplayVenueMap()
  const shouldDisplayVenueMapInSearch = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_VENUE_MAP_IN_SEARCH
  )

  const handleSeeMapPress = () => {
    setInitialVenues(venues?.length ? adaptAlgoliaVenues(venues) : [])
    analytics.logConsultVenueMap({ from: 'searchPlaylist' })
    navigate('VenueMap')
  }

  return (
    <React.Fragment>
      <View>
        <Title>{venuePlaylistTitle}</Title>
        {shouldDisplayVenueMap && !shouldDisplayVenueMapInSearch ? (
          <ButtonContainer>
            <Spacer.Column numberOfSpaces={1} />
            <ButtonTertiaryBlack
              icon={Map}
              wording={`Voir sur la carte (${venues?.length})`}
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
            renderVenueItem({ item, height, width }, searchId)
          }
          renderHeader={undefined}
          renderFooter={undefined}
          keyExtractor={keyExtractor}
          testID="search-venue-list"
          onEndReached={logAllTilesSeenOnce}
        />
      </View>
      <Spacer.Column numberOfSpaces={3} />
      <StyledSeparator />
    </React.Fragment>
  )
}

const Title = styled(TypoDS.Title3)({
  marginHorizontal: getSpacing(6),
})

const StyledSeparator = styled(Separator.Horizontal)({
  width: 'auto',
  marginLeft: getSpacing(6),
  marginRight: getSpacing(6),
})

const ButtonContainer = styled.View({
  marginLeft: getSpacing(6),
  alignSelf: 'flex-start',
})
