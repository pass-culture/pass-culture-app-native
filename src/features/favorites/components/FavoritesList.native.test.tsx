import React from 'react'
import { ListRenderItem, Text } from 'react-native'

import { FavoriteOfferResponseV2 } from 'api/gen'
import { FavoritesList, FavoritesListProps } from 'features/favorites/components/FavoritesList'
import { paginatedOfferFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedOfferFavoritesResponseSnap'
import { FavoriteSortBy, Tab } from 'features/favorites/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils'
import { LINE_BREAK } from 'ui/theme/constants'

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    resetSearch: jest.fn(),
  }),
}))

const mockFavorites: FavoriteOfferResponseV2[] = paginatedOfferFavoritesResponseSnap.favorites

const renderItem: ListRenderItem<FavoriteOfferResponseV2> = ({ item }) => (
  <Text>{item.offer.name}</Text>
)

const defaultProps = {
  favorites: mockFavorites,
  renderItem,
  sortBy: 'RECENTLY_ADDED' as FavoriteSortBy,
  isRefreshing: false,
  onRefresh: jest.fn(),
  selectedTab: Tab.OFFERS,
}

describe('FavoritesList', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should render favorites items using renderItem', () => {
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

const renderFavoritesList = (props: Partial<FavoritesListProps<FavoriteOfferResponseV2>>) => {
  return render(reactQueryProviderHOC(<FavoritesList {...defaultProps} {...props} />))
}
