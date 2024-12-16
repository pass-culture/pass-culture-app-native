import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { Platform, View } from 'react-native'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2, VenueTypeCodeKey } from 'api/gen'
import { VenueMapLocationModal } from 'features/location/components/VenueMapLocationModal'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { SearchStackParamList } from 'features/navigation/SearchStackNavigator/types'
import { NumberOfResults } from 'features/search/components/NumberOfResults/NumberOfResults'
import { SearchVenueItem } from 'features/search/components/SearchVenueItems/SearchVenueItem'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useVenueTypeCodeActions } from 'features/venueMap/store/venueTypeCodeStore'
import { AlgoliaVenue } from 'libs/algolia/types'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { useModal } from 'ui/components/modals/useModal'
import { Playlist } from 'ui/components/Playlist'
import { Separator } from 'ui/components/Separator'
import { Map } from 'ui/svg/icons/Map'
import { getSpacing, LENGTH_XS, LENGTH_XXS, Spacer, TypoDS } from 'ui/theme'

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

const isWeb = Platform.OS === 'web'

export const VenuePlaylist: React.FC<Props> = ({
  venuePlaylistTitle,
  venues,
  isLocated = false,
  currentView = 'SearchResults',
  offerCategory,
  shouldDisplaySeparator = true,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { setVenueTypeCode } = useVenueTypeCodeActions()
  const {
    searchState: { searchId },
  } = useSearch()
  const enabledVenueMap = useFeatureFlag(RemoteStoreFeatureFlags.WIP_VENUE_MAP)

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

  const isMapWithoutPositionAndNotLocated = !isLocated && !isWeb

  const handleSeeMapPress = () => {
    if (offerCategory === SearchGroupNameEnumv2.LIVRES) {
      setVenueTypeCode(VenueTypeCodeKey.BOOKSTORE)
    }
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
      <View>
        <Title>{venuePlaylistTitle}</Title>
        {shouldDisplaySeeOnMapButton ? (
          <ButtonContainer>
            <Spacer.Column numberOfSpaces={1} />
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
            renderVenueItem({ item, height, width }, searchId)
          }
          renderHeader={undefined}
          renderFooter={undefined}
          keyExtractor={keyExtractor}
          testID="search-venue-list"
          onEndReached={logAllTilesSeenOnce}
        />
      </View>
      {shouldDisplaySeparator ? <StyledSeparator testID="venue-playlist-separator" /> : null}
      <VenueMapLocationModal
        visible={venueMapLocationModalVisible}
        dismissModal={hideVenueMapLocationModal}
        openedFrom="searchPlaylist"
      />
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
  marginTop: getSpacing(3),
})

const ButtonContainer = styled.View({
  marginLeft: getSpacing(6),
  alignSelf: 'flex-start',
})
