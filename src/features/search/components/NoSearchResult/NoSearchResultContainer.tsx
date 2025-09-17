import React from 'react'
import styled from 'styled-components/native'

import { NoSearchResult } from 'features/search/components/NoSearchResult/NoSearchResult'
import { SearchState } from 'features/search/types'
import { analytics } from 'libs/analytics/provider'
import { LocationMode } from 'libs/location/types'

export const NoSearchResultContainer = ({
  searchState,
  navigateToSearchFilter,
  onResetPlace,
  navigateToSearchResults,
}: {
  searchState: SearchState
  navigateToSearchFilter: (searchState: SearchState) => void
  onResetPlace: () => void
  navigateToSearchResults: (searchState: SearchState) => void
}) => {
  const isEverywhereSearch = searchState.locationFilter.locationType === LocationMode.EVERYWHERE
  const noResultsProps = {
    title: 'Pas de résultat',
    subtitle: searchState.query ? `pour "${searchState.query}"` : '',
    errorDescription: searchState.query
      ? 'Essaye un autre mot-clé, vérifie ta localisation ou modifie tes filtres pour trouver plus de résultats.'
      : 'Vérifie ta localisation ou modifie tes filtres pour trouver plus de résultats.',
  }

  return (
    <NoSearchResultsWrapper>
      {isEverywhereSearch ? (
        <NoSearchResult
          {...noResultsProps}
          ctaWording="Modifier mes filtres"
          onPress={() => navigateToSearchFilter(searchState)}
        />
      ) : (
        <NoSearchResult
          {...noResultsProps}
          errorDescription="Élargis la zone de recherche pour plus de résultats."
          ctaWording="Élargir la zone de recherche"
          onPress={() => {
            analytics.logExtendSearchRadiusClicked(searchState.searchId)
            onResetPlace()
            navigateToSearchResults({
              ...searchState,
              locationFilter: {
                locationType: LocationMode.EVERYWHERE,
              },
            })
          }}
        />
      )}
    </NoSearchResultsWrapper>
  )
}

const NoSearchResultsWrapper = styled.View({
  flex: 1,
  flexDirection: 'row',
})
