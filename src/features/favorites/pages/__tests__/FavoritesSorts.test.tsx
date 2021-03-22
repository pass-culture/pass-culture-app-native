import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { goBack } from '__mocks__/@react-navigation/native'
import { initialFavoritesState } from 'features/favorites/pages/reducer'

import { FavoritesSorts } from '../FavoritesSorts'

const mockFavoritesState = initialFavoritesState

jest.mock('features/favorites/pages/FavoritesWrapper', () => ({
  useFavoritesState: () => ({
    ...mockFavoritesState,
    dispatch: jest.fn(),
  }),
}))

describe('FavoritesSorts component', () => {
  afterEach(jest.resetAllMocks)

  it('should render correctly', () => {
    const { toJSON } = render(<FavoritesSorts />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should go back on validate', async () => {
    jest.spyOn(React, 'useRef').mockReturnValueOnce({
      current: goBack,
    })
    const renderAPI = render(<FavoritesSorts />)
    fireEvent.press(renderAPI.getByText('Valider'))

    await waitForExpect(() => {
      expect(goBack).toBeCalled()
    })
  })
})
