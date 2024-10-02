import { useNavigationState } from '@react-navigation/native'
import { SendEventForHits } from 'instantsearch.js/es/lib/utils'
import React, { useMemo } from 'react'
import { Keyboard, Text } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { Highlight } from 'features/search/components/Highlight/Highlight'
import { useSearch } from 'features/search/context/SearchWrapper'
import {
  getNativeCategoryFromEnum,
  getSearchGroupsEnumArrayFromNativeCategoryEnum,
  isNativeCategoryOfCategory,
  useNativeCategories,
} from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { useNavigateToSearch } from 'features/search/helpers/useNavigateToSearch/useNavigateToSearch'
import { CreateHistoryItem, SearchState, SearchView } from 'features/search/types'
import { AlgoliaFacetsAnalyticsNativeCategory, AlgoliaSuggestionHit } from 'libs/algolia/types'
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
  offerCategories?: SearchGroupNameEnumv2[]
}

export function AutocompleteOfferItem({
  hit,
  sendEvent,
  addSearchHistory,
  shouldShowCategory,
  offerCategories,
}: AutocompleteOfferItemProps) {
  const { query, [env.ALGOLIA_OFFERS_INDEX_NAME]: indexInfos } = hit
  // https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/how-to/adding-category-suggestions/js/#suggestions-with-categories-index-schema
  const {
    ['offer.searchGroupNamev2']: categories = [],
    ['offer.nativeCategoryId']: nativeCategories = [],
  } = indexInfos?.facets?.analytics || {}

  const searchGroupNativeCategories = useNativeCategories(offerCategories?.[0])

  const { searchState, dispatch, hideSuggestions } = useSearch()
  const routes = useNavigationState((state) => state?.routes)
  const currentRoute = routes?.[routes?.length - 1]?.name
  const { navigateToSearch: navigateToSearchResults } = useNavigateToSearch('SearchResults')
  const { disabilities } = useAccessibilityFiltersContext()
  const { data } = useSubcategories()

  const isfilmsSeriesCinemaSearchGroup =
    categories.length &&
    (categories?.[0]?.value === SearchGroupNameEnumv2.CINEMA ||
      categories?.[0]?.value === SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES)

  const searchGroupLabel = useSearchGroupLabel(categories[0]?.value ?? SearchGroupNameEnumv2.NONE)

  const hasSearchGroup = !!offerCategories?.length

  const isAcceptableResultForCurrentCategory = useMemo(() => {
    return searchGroupNativeCategories.some(
      (searchGroupNativeCategory) =>
        nativeCategories[0] && searchGroupNativeCategory[0] === nativeCategories[0].value
    )
  }, [searchGroupNativeCategories, nativeCategories])

  const mostPopularNativeCategoryId = useMemo(() => {
    if (nativeCategories[0]?.value && nativeCategories[0].value in NativeCategoryIdEnumv2) {
      const categoryWithMaxCount = nativeCategories.reduce<AlgoliaFacetsAnalyticsNativeCategory>(
        (previous, current) => {
          return current.count > (previous?.count || 0) ? current : previous
        },
        nativeCategories[0]
      )
      return categoryWithMaxCount.value
    }
    return undefined
  }, [nativeCategories])

  const mostPopularNativeCategoryValue = getNativeCategoryFromEnum(
    data,
    mostPopularNativeCategoryId
  )?.value

  const hasMostPopularHitNativeCategory =
    nativeCategories.length > 0 && !!mostPopularNativeCategoryId
  const hasMostPopularHitCategory =
    categories[0]?.value && categories[0].value in SearchGroupNameEnumv2
  const categoriesFromNativeCategory = useMemo(
    () => getSearchGroupsEnumArrayFromNativeCategoryEnum(data, mostPopularNativeCategoryId),
    [data, mostPopularNativeCategoryId]
  )
  const hasSeveralCategoriesFromNativeCategory = categoriesFromNativeCategory.length > 1
  const isAssociatedMostPopularNativeCategoryToMostPopularCategory = useMemo(
    () => isNativeCategoryOfCategory(data, categories[0]?.value, mostPopularNativeCategoryId),
    [categories, data, mostPopularNativeCategoryId]
  )

  const shouldUseSearchGroupInsteadOfNativeCategory =
    nativeCategories[0]?.value == NativeCategoryIdEnumv2.LIVRES_PAPIER ||
    (hasSearchGroup && !isAcceptableResultForCurrentCategory)

  const mostPopularCategory = useMemo(() => {
    if (
      hasSeveralCategoriesFromNativeCategory ||
      !hasMostPopularHitNativeCategory ||
      shouldUseSearchGroupInsteadOfNativeCategory
    ) {
      return categories[0]?.value && categories[0].value in SearchGroupNameEnumv2
        ? [categories[0].value]
        : []
    } else {
      return categoriesFromNativeCategory[0] &&
        categoriesFromNativeCategory[0] in SearchGroupNameEnumv2
        ? [categoriesFromNativeCategory[0]]
        : []
    }
  }, [
    categories,
    categoriesFromNativeCategory,
    hasMostPopularHitNativeCategory,
    hasSeveralCategoriesFromNativeCategory,
    shouldUseSearchGroupInsteadOfNativeCategory,
  ])

  const onPress = () => {
    sendEvent('click', hit, 'Suggestion clicked')
    Keyboard.dismiss()
    // When we hit enter, we may have selected a category or a venue on the search landing page
    // these are the two potentially 'staged' filters that we want to commit to the global search state.
    // We also want to commit the price filter, as beneficiary users may have access to different offer
    // price range depending on their available credit.
    const searchId = uuidv4()
    const shouldFilterOnNativeCategory =
      shouldShowCategory &&
      hasMostPopularHitNativeCategory &&
      !shouldUseSearchGroupInsteadOfNativeCategory &&
      ((hasSeveralCategoriesFromNativeCategory &&
        isAssociatedMostPopularNativeCategoryToMostPopularCategory) ||
        !hasSeveralCategoriesFromNativeCategory)
    const newSearchState: SearchState = {
      ...searchState,
      query,
      searchId,
      isAutocomplete: true,
      offerGenreTypes: undefined,
      offerNativeCategories:
        shouldFilterOnNativeCategory && nativeCategories[0]?.value
          ? [nativeCategories[0].value]
          : undefined,
      offerCategories: shouldShowCategory ? mostPopularCategory : [],
      isFromHistory: undefined,
      gtls: [],
    }

    addSearchHistory({
      query,
      nativeCategory: shouldFilterOnNativeCategory ? nativeCategories[0]?.value : undefined,
      category: shouldShowCategory ? mostPopularCategory[0] : undefined,
    })
    dispatch({ type: 'SET_STATE', payload: newSearchState })
    if (currentRoute && [SearchView.Landing, SearchView.N1].includes(currentRoute as SearchView)) {
      navigateToSearchResults(newSearchState, disabilities)
    }
    hideSuggestions()
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
        {shouldDisplaySuggestion ? (
          <React.Fragment>
            <Typo.Body> dans </Typo.Body>
            <Typo.ButtonTextPrimary>
              {(shouldDisplayNativeCategory && !shouldUseSearchGroupInsteadOfNativeCategory) ||
              isfilmsSeriesCinemaSearchGroup
                ? mostPopularNativeCategoryValue
                : searchGroupLabel}
            </Typo.ButtonTextPrimary>
          </React.Fragment>
        ) : null}
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
