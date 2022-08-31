import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialSearchState } from 'features/search/pages/reducer'
import { MAX_PRICE } from 'features/search/pages/reducer.helpers'
import { SearchPrice } from 'features/search/pages/SearchPrice'
import { SearchView } from 'features/search/types'
import { fireEvent, render } from 'tests/utils'

const mockSearchState = initialSearchState

const mockDispatch = jest.fn()
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

describe('SearchPrice component', () => {
  it('should render correctly', () => {
    expect(render(<SearchPrice />)).toMatchSnapshot()
  })

  it('should navigate on search results when pressing on search button', async () => {
    const { getByPlaceholderText, getByText } = render(<SearchPrice />)

    const minPriceInput = getByPlaceholderText('0')
    await fireEvent(minPriceInput, 'onChangeText', '5')

    const maxPriceInput = getByPlaceholderText(`${MAX_PRICE}`)
    await fireEvent(maxPriceInput, 'onChangeText', '20')

    const searchButton = getByText('Rechercher')
    await fireEvent.press(searchButton)

    const expectedSearchParams = {
      ...mockSearchState,
      minPrice: '5',
      maxPrice: '20',
      view: SearchView.Results,
    }
    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      params: expectedSearchParams,
      screen: 'Search',
    })
  })

  it('should not update the minimum price if the enter do not respect the expected format', async () => {
    const { getByPlaceholderText } = render(<SearchPrice />)

    const minPriceInput = getByPlaceholderText('0')
    await fireEvent(minPriceInput, 'onChangeText', '9,99')

    await fireEvent(minPriceInput, 'onChangeText', '9,999')

    expect(minPriceInput.props.value).toStrictEqual('9,99')
  })

  it('should not update the maximum price if the enter do not respect the expected format', async () => {
    const { getByPlaceholderText } = render(<SearchPrice />)

    const maxPriceInput = getByPlaceholderText(`${MAX_PRICE}`)
    await fireEvent(maxPriceInput, 'onChangeText', '9,99')

    await fireEvent(maxPriceInput, 'onChangeText', '9,999')

    expect(maxPriceInput.props.value).toStrictEqual('9,99')
  })

  it('should navigate on search results when pressing previous button', async () => {
    const { getByTestId } = render(<SearchPrice />)

    const previousButton = getByTestId('backButton')
    await fireEvent.press(previousButton)

    const expectedSearchParams = { ...mockSearchState, view: SearchView.Results }
    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      params: expectedSearchParams,
      screen: 'Search',
    })
  })
})
