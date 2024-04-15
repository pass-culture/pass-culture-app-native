import { SendEventForHits } from 'instantsearch.js/es/lib/utils'
import React, { useMemo } from 'react'
import { Keyboard, Text } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { Highlight } from 'features/search/components/Highlight/Highlight'
import { useSearch } from 'features/search/context/SearchWrapper'
import {
  getNativeCategoryFromEnum,
  getSearchGroupsEnumArrayFromNativeCategoryEnum,
  isNativeCategoryOfCategory,
} from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { CreateHistoryItem, SearchState } from 'features/search/types'
import { AlgoliaSuggestionHit } from 'libs/algolia/types'
import { env } from 'libs/environment'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
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
    // @ts-expect-error: because of noUncheckedIndexedAccess
    indexInfos.facets.analytics

  const { searchState, dispatch, hideSuggestions } = useSearch()
  const { data } = useSubcategories()
  const enableNewMapping = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_MAPPING_BOOKS)

  const isfilmsSeriesCinemaSearchGroup =
    categories.length && categories?.[0]?.value === SearchGroupNameEnumv2.FILMS_SERIES_CINEMA

  const searchGroupLabel = useSearchGroupLabel(
    // @ts-expect-error: because of noUncheckedIndexedAccess
    categories.length > 0 ? categories[0]?.value : SearchGroupNameEnumv2.NONE
  )

  const mostPopularNativeCategoryId =
    // @ts-expect-error: because of noUncheckedIndexedAccess
    nativeCategories[0]?.value in NativeCategoryIdEnumv2 ? nativeCategories[0]?.value : undefined
  const mostPopularNativeCategoryValue = getNativeCategoryFromEnum(
    data,
    mostPopularNativeCategoryId
  )?.value
  const hasMostPopularHitNativeCategory =
    nativeCategories.length > 0 && !!mostPopularNativeCategoryId
  const hasMostPopularHitCategory =
    // @ts-expect-error: because of noUncheckedIndexedAccess
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

  const shouldUseSearchGroupInsteadOfNativeCategory =
    enableNewMapping && nativeCategories[0]?.value == NativeCategoryIdEnumv2.LIVRES_PAPIER

  const mostPopularCategory = useMemo(() => {
    if (hasSeveralCategoriesFromNativeCategory || !hasMostPopularHitNativeCategory) {
      // @ts-expect-error: because of noUncheckedIndexedAccess
      return categories.length > 0 && categories[0].value in SearchGroupNameEnumv2
        ? // @ts-expect-error: because of noUncheckedIndexedAccess
          [categories[0].value]
        : []
    } else {
      // @ts-expect-error: because of noUncheckedIndexedAccess
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
      offerNativeCategories: shouldFilteredOnNativeCategory
        ? // @ts-expect-error: because of noUncheckedIndexedAccess
          [nativeCategories[0].value]
        : undefined,
      // @ts-expect-error: because of noUncheckedIndexedAccess
      offerCategories: shouldShowCategory ? mostPopularCategory : [],
      isFromHistory: undefined,
    }
    addSearchHistory({
      query,
      // @ts-expect-error: because of noUncheckedIndexedAccess
      nativeCategory: shouldFilteredOnNativeCategory ? nativeCategories[0].value : undefined,
      category: shouldShowCategory ? mostPopularCategory[0] : undefined,
    })
    dispatch({ type: 'SET_STATE', payload: newSearchState })
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
        {!!shouldDisplaySuggestion && (
          <React.Fragment>
            <Typo.Body> dans </Typo.Body>
            <Typo.ButtonTextPrimary>
              {(shouldDisplayNativeCategory && !shouldUseSearchGroupInsteadOfNativeCategory) ||
              isfilmsSeriesCinemaSearchGroup
                ? mostPopularNativeCategoryValue
                : searchGroupLabel}
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
