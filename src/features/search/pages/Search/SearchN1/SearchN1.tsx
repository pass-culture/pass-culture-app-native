import { useRoute } from '@react-navigation/native'
import React, { useMemo } from 'react'
import { ScrollView } from 'react-native-gesture-handler'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { GtlPlaylist } from 'features/gtlPlaylist/components/GtlPlaylist'
import { useGTLPlaylists } from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { SearchStackRouteName } from 'features/navigation/SearchStackNavigator/types'
import { CATEGORY_CRITERIA, Gradient } from 'features/search/enums'
import { useNativeCategories } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { SearchN1Bar } from 'features/search/pages/Search/SearchN1/SearchN1Bar'
import { NativeCategoryEnum } from 'features/search/types'
import { LoadingState } from 'features/venue/components/VenueOffers/VenueOffers'
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
  })

  const offerCategories = params?.offerCategories as SearchGroupNameEnumv2[]
  const offerCategory = offerCategories?.[0] || SearchGroupNameEnumv2.LIVRES
  const isBookCategory = offerCategory === SearchGroupNameEnumv2.LIVRES

  const nativeCategories = useNativeCategories(offerCategory)
  const colorsGradients = CATEGORY_CRITERIA[offerCategory]?.gradients as Gradient

  const subCategoriesContent = useMemo(
    () =>
      nativeCategories.map((nativeCategory) => ({
        label: nativeCategory[1].label,
        colors: colorsGradients,
        nativeCategory: nativeCategory[0] as NativeCategoryEnum,
      })),
    [colorsGradients, nativeCategories]
  )

  if (arePlaylistsLoading) {
    return <LoadingState />
  }

  return (
    <ScrollView>
      <SearchN1Bar
        offerCategories={offerCategories}
        placeholder={`Rechercher parmi les ${titles[offerCategory].toLowerCase()}`}
        title={titles[offerCategory]}
      />
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
  )
}
