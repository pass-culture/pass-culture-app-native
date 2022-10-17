import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialFavoritesState } from 'features/favorites/context/reducer'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SearchView } from 'features/search/types'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render } from 'tests/utils'

import { NoFavoritesResult } from './NoFavoritesResult'

const mockFavoritesState = initialFavoritesState
const mockDispatch = jest.fn()
const mockDispatchSearch = jest.fn()

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    dispatch: mockDispatchSearch,
  }),
}))

jest.mock('features/favorites/context/FavoritesWrapper', () => ({
  useFavoritesState: () => ({
    ...mockFavoritesState,
    dispatch: mockDispatch,
  }),
}))

describe('NoFavoritesResult component', () => {
  it('should show the message', () => {
    const text = render(<NoFavoritesResult />).getByText(
      `Retrouve toutes tes offres en un clin d’oeil`
    )
    expect(text).toBeTruthy()
  })

  it('should navigate to Search when pressing button and log event', async () => {
    const renderAPI = render(<NoFavoritesResult />)
    const button = renderAPI.getByText('Découvrir le catalogue')
    await fireEvent.press(button)
    expect(navigate).toBeCalledWith(...getTabNavConfig('Search', { view: SearchView.Landing }))
    expect(analytics.logDiscoverOffers).toHaveBeenCalledWith('favorites')
  })
})
