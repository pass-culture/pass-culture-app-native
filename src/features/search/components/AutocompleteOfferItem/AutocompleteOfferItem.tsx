import { useNavigation } from '@react-navigation/native'
import { SendEventForHits } from 'instantsearch.js/es/lib/utils'
import React, { useMemo } from 'react'
import { Keyboard, Text } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { Highlight } from 'features/search/components/Highlight/Highlight'
import { useSearch } from 'features/search/context/SearchWrapper'
import {
  getNativeCategoryFromEnum,
  getSearchGroupsEnumArrayFromNativeCategoryEnum,
  isNativeCategoryOfCategory,
} from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { CreateHistoryItem, SearchState, SearchView } from 'features/search/types'
import { AlgoliaSuggestionHit } from 'libs/algolia'
import { env } from 'libs/environment'
import { useSearchGroupLabel } from 'libs/subcategories'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { MagnifyingGlassFilled } from 'ui/svg/icons/MagnifyingGlassFilled'
import { getSpacing, Typo } from 'ui/theme'

type AutocompleteOfferItemProps = {
  hit: AlgoliaSuggestionHit
  sendEvent: SendEventForHits
  addSearchHistory: (item: CreateHistoryItem) => void
  shouldShowCategory?: boolean
}

export function AutocompleteOfferItem({
  hit,
  sendEvent,
  addSearchHistory,
  shouldShowCategory,
}: AutocompleteOfferItemProps) {
  const { query, [env.ALGOLIA_OFFERS_INDEX_NAME]: indexInfos } = hit
  // https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/how-to/adding-category-suggestions/js/#suggestions-with-categories-index-schema
  const { ['offer.searchGroupNamev2']: categories, ['offer.nativeCategoryId']: nativeCategories } =
    indexInfos.facets.analytics
  const { searchState } = useSearch()
  const { navigate } = useNavigation<UseNavigationType>()
  const { data } = useSubcategories()
  const searchGroupLabel = useSearchGroupLabel(
    categories.length > 0 ? categories[0].value : SearchGroupNameEnumv2.NONE
  )
  const mostPopularNativeCategoryId =
    nativeCategories[0]?.value in NativeCategoryIdEnumv2 ? nativeCategories[0]?.value : undefined
  const mostPopularNativeCategoryValue = getNativeCategoryFromEnum(
    data,
    mostPopularNativeCategoryId
  )?.value
  const hasMostPopularHitNativeCategory =
    nativeCategories.length > 0 && !!mostPopularNativeCategoryId
  const hasMostPopularHitCategory =
    categories.length > 0 && categories[0].value in SearchGroupNameEnumv2
  const categoriesFromNativeCategory = useMemo(
    () => getSearchGroupsEnumArrayFromNativeCategoryEnum(data, mostPopularNativeCategoryId),
    [data, mostPopularNativeCategoryId]
  )
  const hasSeveralCategoriesFromNativeCategory = categoriesFromNativeCategory.length > 1
  const isAssociatedMostPopularNativeCategoryToMostPopularCategory = useMemo(
    () => isNativeCategoryOfCategory(data, categories[0]?.value, mostPopularNativeCategoryId),
    [categories, data, mostPopularNativeCategoryId]
  )

  const mostPopularCategory = useMemo(() => {
    if (hasSeveralCategoriesFromNativeCategory || !hasMostPopularHitNativeCategory) {
      return categories.length > 0 && categories[0].value in SearchGroupNameEnumv2
        ? [categories[0].value]
        : []
    } else {
      return categoriesFromNativeCategory[0] in SearchGroupNameEnumv2
        ? [categoriesFromNativeCategory[0]]
        : []
    }
  }, [
    categories,
    categoriesFromNativeCategory,
    hasMostPopularHitNativeCategory,
    hasSeveralCategoriesFromNativeCategory,
  ])

  const onPress = () => {
    sendEvent('click', hit, 'Suggestion clicked')
    Keyboard.dismiss()
    // When we hit enter, we may have selected a category or a venue on the search landing page
    // these are the two potentially 'staged' filters that we want to commit to the global search state.
    // We also want to commit the price filter, as beneficiary users may have access to different offer
    // price range depending on their available credit.
    const searchId = uuidv4()
    const shouldFilteredOnNativeCategory =
      shouldShowCategory &&
      hasMostPopularHitNativeCategory &&
      ((hasSeveralCategoriesFromNativeCategory &&
        isAssociatedMostPopularNativeCategoryToMostPopularCategory) ||
        !hasSeveralCategoriesFromNativeCategory)
    const newSearchState: SearchState = {
      ...searchState,
      query,
      view: SearchView.Results,
      searchId,
      isAutocomplete: true,
      offerGenreTypes: undefined,
      offerNativeCategories: shouldFilteredOnNativeCategory
        ? [nativeCategories[0].value]
        : undefined,
      offerCategories: shouldShowCategory ? mostPopularCategory : [],
      isFromHistory: undefined,
    }
    addSearchHistory({
      query,
      nativeCategory: shouldFilteredOnNativeCategory ? nativeCategories[0].value : undefined,
      category: shouldShowCategory ? mostPopularCategory[0] : undefined,
    })

    navigate(...getTabNavConfig('Search', newSearchState))
  }

  const shouldDisplayNativeCategory =
    (!hasSeveralCategoriesFromNativeCategory ||
      isAssociatedMostPopularNativeCategoryToMostPopularCategory) &&
    hasMostPopularHitNativeCategory

  const shouldDisplaySuggestion =
    shouldShowCategory && (hasMostPopularHitNativeCategory || hasMostPopularHitCategory)

  const testID = `autocompleteOfferItem_${hit.objectID}`

  return (
    <AutocompleteItemTouchable testID={testID} onPress={onPress}>
      <MagnifyingGlassIconContainer>
        <MagnifyingGlassFilledIcon />
      </MagnifyingGlassIconContainer>
      <StyledText numberOfLines={1} ellipsizeMode="tail">
        <Highlight suggestionHit={hit} attribute="query" />
        {!!shouldDisplaySuggestion && (
          <React.Fragment>
            <Typo.Body> dans </Typo.Body>
            <Typo.ButtonTextPrimary>
              {shouldDisplayNativeCategory ? mostPopularNativeCategoryValue : searchGroupLabel}
            </Typo.ButtonTextPrimary>
          </React.Fragment>
        )}
      </StyledText>
    </AutocompleteItemTouchable>
  )
}

const MagnifyingGlassIconContainer = styled.View({ flexShrink: 0 })

const AutocompleteItemTouchable = styled.TouchableOpacity({
  flexDirection: 'row',
  alignItems: 'center',
  paddingBottom: getSpacing(4),
})

const MagnifyingGlassFilledIcon = styled(MagnifyingGlassFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.colors.greyDark,
}))``

const StyledText = styled(Text)({
  marginLeft: getSpacing(2),
})
