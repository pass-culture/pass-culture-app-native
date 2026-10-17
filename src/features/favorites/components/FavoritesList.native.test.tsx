import React from 'react'

import { FavoriteResponse } from 'api/gen'
import { FavoritesList, FavoritesListProps } from 'features/favorites/components/FavoritesList'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import { FavoriteSortBy, Tab } from 'features/favorites/types'
import { beneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils'
import { LINE_BREAK } from 'ui/theme/constants'

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    resetSearch: jest.fn(),
  }),
}))

const mockFavorites: FavoriteResponse[] = paginatedFavoritesResponseSnap.favorites

const defaultProps = {
  favorites: mockFavorites,
  sortBy: 'RECENTLY_ADDED' as FavoriteSortBy,
  isRefreshing: false,
  onRefresh: jest.fn(),
  onBookOffer: jest.fn(),
  selectedTab: Tab.OFFERS,
  user: beneficiaryUser,
}

describe('FavoritesList', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should render favorites items when user and credit are available', () => {
    renderFavoritesList({})

    expect(screen.getByText('Spectacle une seule date')).toBeOnTheScreen()
    expect(screen.getByText('Je ne sais pas ce que je dis')).toBeOnTheScreen()
  })

  it('should render number of results header with correct count and tab', () => {
    renderFavoritesList({ enableFavoritesHub: true })

    expect(screen.getByText('4 offres en favoris')).toBeOnTheScreen()
  })

  it('should render empty component when favorites list is empty', () => {
    renderFavoritesList({ favorites: [] })

    const explanations =
      'Tu n’as pas encore de favori\u00a0?' +
      LINE_BREAK +
      'Explore le catalogue pass Culture et ajoute les offres en favori pour les retrouver facilement\u00a0!'

    expect(screen.getByText(explanations)).toBeOnTheScreen()
  })

  it('should call onRefresh when pulled to refresh', () => {
    renderFavoritesList({})
    const flatList = screen.getByTestId('favoritesResultsFlatlist')

    fireEvent(flatList, 'refresh')

    expect(defaultProps.onRefresh).toHaveBeenCalledTimes(1)
  })
})

const renderFavoritesList = (props: Partial<FavoritesListProps>) => {
  return render(reactQueryProviderHOC(<FavoritesList {...defaultProps} {...props} />))
}
