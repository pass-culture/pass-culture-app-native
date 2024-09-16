import { useRoute } from '@react-navigation/native'
import React, { useMemo } from 'react'
import { ScrollView } from 'react-native-gesture-handler'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { GtlPlaylist } from 'features/gtlPlaylist/components/GtlPlaylist'
import { useGTLPlaylists } from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { SearchStackRouteName } from 'features/navigation/SearchStackNavigator/types'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { useNativeCategories } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { SearchN1Bar } from 'features/search/pages/Search/SearchN1/SearchN1Bar'
import { LoadingState } from 'features/venue/components/VenueOffers/VenueOffers'
import { env } from 'libs/environment'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { SubcategoryButtonList } from 'ui/components/buttons/SubcategoryButton/SubcategoryButtonList'
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

  const nativeCategories = useNativeCategories(offerCategory)
  const offerCategoryTheme = useMemo(
    () => ({
      backgroundColor: CATEGORY_CRITERIA[offerCategory]?.fillColor,
      borderColor: CATEGORY_CRITERIA[offerCategory]?.borderColor,
    }),
    [offerCategory]
  )

  const subCategoriesContent = useMemo(
    () =>
      nativeCategories.map((nativeCategory) => ({
        label: nativeCategory[1].label,
        backgroundColor: offerCategoryTheme.backgroundColor,
        borderColor: offerCategoryTheme.borderColor,
        nativeCategory: nativeCategory[0],
      })),
    [offerCategoryTheme, nativeCategories]
  )

  if (arePlaylistsLoading) {
    return <LoadingState />
  }

  return (
    <SearchN1Bar
      offerCategories={offerCategories}
      placeholder={`${titles[offerCategory]}...`}
      title={titles[offerCategory]}>
      <ScrollView>
        <SubcategoryButtonList subcategoryButtonContent={subCategoriesContent} />
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
