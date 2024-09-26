import { useRoute } from '@react-navigation/native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { GtlPlaylist } from 'features/gtlPlaylist/components/GtlPlaylist'
import { useGTLPlaylists } from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { SearchStackRouteName } from 'features/navigation/SearchStackNavigator/types'
import { SearchN1Bar } from 'features/search/pages/Search/SearchN1/SearchN1Bar'
import { LoadingState } from 'features/venue/components/VenueOffers/VenueOffers'
import { env } from 'libs/environment'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { SubcategoryButtonListWrapper } from 'ui/components/buttons/SubcategoryButton/SubcategoryButtonListWrapper'
import { Spacer } from 'ui/theme'

const titles = PLACEHOLDER_DATA.searchGroups.reduce((previousValue, currentValue) => {
  return { ...previousValue, [currentValue.name]: currentValue.value }
}, {}) as Record<SearchGroupNameEnumv2, string>

export const SearchN1: React.FC = () => {
  const { params } = useRoute<UseRouteType<SearchStackRouteName>>()
  const { gtlPlaylists, isLoading: arePlaylistsLoading } = useGTLPlaylists({
    queryKey: 'SEARCH_N1_BOOKS_GTL_PLAYLISTS',
    searchIndex: env.ALGOLIA_OFFERS_INDEX_NAME_B,
  })

  const offerCategories = params?.offerCategories as SearchGroupNameEnumv2[]
  const offerCategory = offerCategories?.[0] || SearchGroupNameEnumv2.LIVRES
  const isBookCategory = offerCategory === SearchGroupNameEnumv2.LIVRES

  if (arePlaylistsLoading) {
    return <LoadingState />
  }

  return (
    <SearchN1Bar
      offerCategories={offerCategories}
      placeholder={`${titles[offerCategory]}...`}
      title={titles[offerCategory]}>
      <ScrollView>
        <SubcategoryButtonListWrapper offerCategory={offerCategory} />
        {isBookCategory && gtlPlaylists.length > 0 ? (
          <React.Fragment>
            {gtlPlaylists.map((playlist) => (
              <GtlPlaylist
                key={playlist.entryId}
                playlist={playlist}
                analyticsFrom="searchn1"
                route="SearchN1"
              />
            ))}
            <Spacer.Column numberOfSpaces={6} />
          </React.Fragment>
        ) : null}
        <Spacer.Column numberOfSpaces={6} />
      </ScrollView>
    </SearchN1Bar>
  )
}
