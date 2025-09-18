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
  const title = 'Pas de résultat'
  const subtitle = searchState.query ? `pour "${searchState.query}"` : ''

  const noResultsProps = {
    errorDescription: 'Élargis la zone de recherche pour plus de résultats.',
    ctaWording: 'Élargir la zone de recherche',
    onPress: () => {
      analytics.logExtendSearchRadiusClicked(searchState.searchId)
      onResetPlace()
      navigateToSearchResults({
        ...searchState,
        locationFilter: {
          locationType: LocationMode.EVERYWHERE,
        },
      })
    },
  }

  const noResultsEverywhereProps = {
    errorDescription: searchState.query
      ? 'Essaye un autre mot-clé, vérifie ta localisation ou modifie tes filtres pour trouver plus de résultats.'
      : 'Vérifie ta localisation ou modifie tes filtres pour trouver plus de résultats.',
    ctaWording: 'Modifier mes filtres',
    onPress: () => navigateToSearchFilter(searchState),
  }
  const props =
    searchState.locationFilter.locationType === LocationMode.EVERYWHERE
      ? noResultsEverywhereProps
      : noResultsProps

  return (
    <NoSearchResultsWrapper>
      <NoSearchResult {...props} title={title} subtitle={subtitle} />
    </NoSearchResultsWrapper>
  )
}

const NoSearchResultsWrapper = styled.View({
  flex: 1,
  flexDirection: 'row',
})
