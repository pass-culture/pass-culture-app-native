import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { useAuthContext } from 'features/auth/AuthContext'
import { useUserProfileInfo } from 'features/profile/api'
import { initialSearchState } from 'features/search/pages/reducer'
import { MAX_PRICE } from 'features/search/pages/reducer.helpers'
import { SearchPrice } from 'features/search/pages/SearchPrice'
import { SearchView } from 'features/search/types'
import { fireEvent, render } from 'tests/utils'

let mockSearchState = initialSearchState

const mockDispatch = jest.fn()
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

const mockedUseUserProfileInfo = useUserProfileInfo as jest.Mock
jest.mock('features/profile/api', () => ({
  useUserProfileInfo: jest.fn(() => ({
    data: {
      isBeneficiary: true,
      domainsCredit: { all: { initial: 30000, remaining: 10000 } },
    },
  })),
}))

const mockedUseAuthContext = useAuthContext as jest.Mock
jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

jest.mock('react-query')

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

  it('should reset minimum price when pressing reset button', async () => {
    const { getByPlaceholderText, getByText } = render(<SearchPrice />)

    const minPriceInput = getByPlaceholderText('0')
    await fireEvent(minPriceInput, 'onChangeText', '5')

    const resetButton = getByText('Réinitialiser')
    await fireEvent.press(resetButton)

    expect(minPriceInput.props.value).toStrictEqual('')
  })

  it('should reset maximum price when pressing reset button', async () => {
    const { getByPlaceholderText, getByText } = render(<SearchPrice />)

    const maxPriceInput = getByPlaceholderText(`${MAX_PRICE}`)
    await fireEvent(maxPriceInput, 'onChangeText', '20')

    const resetButton = getByText('Réinitialiser')
    await fireEvent.press(resetButton)

    expect(maxPriceInput.props.value).toStrictEqual('')
  })

  it('should update the maximum price when activate limit credit search toggle', async () => {
    const { getByTestId, getByPlaceholderText } = render(<SearchPrice />)

    const toggleLimitCreditSearch = getByTestId('Interrupteur-limitCreditSearch')
    await fireEvent.press(toggleLimitCreditSearch)

    const maxPriceInput = getByPlaceholderText(`${MAX_PRICE}`)
    expect(maxPriceInput.props.value).toStrictEqual('100')
  })

  it('should disable the maximum price input when activate limit credit search toggle', async () => {
    const { getByTestId, getByPlaceholderText } = render(<SearchPrice />)

    const toggleLimitCreditSearch = getByTestId('Interrupteur-limitCreditSearch')
    await fireEvent.press(toggleLimitCreditSearch)

    const maxPriceInput = getByPlaceholderText(`${MAX_PRICE}`)
    expect(maxPriceInput.props.disabled).toStrictEqual(true)
  })

  it('should reset the maximum price when desactivate limit credit search toggle and no max price entered in the current search', async () => {
    const { getByTestId, getByPlaceholderText } = render(<SearchPrice />)

    const toggleLimitCreditSearch = getByTestId('Interrupteur-limitCreditSearch')
    await fireEvent.press(toggleLimitCreditSearch)
    await fireEvent.press(toggleLimitCreditSearch)

    const maxPriceInput = getByPlaceholderText(`${MAX_PRICE}`)
    expect(maxPriceInput.props.value).toStrictEqual('')
  })

  it('should update the maximum price by the max price entered in the current search when desactivate limit credit search toggle', async () => {
    mockSearchState = { ...initialSearchState, maxPrice: '15' }
    const { getByTestId, getByPlaceholderText } = render(<SearchPrice />)

    const toggleLimitCreditSearch = getByTestId('Interrupteur-limitCreditSearch')
    await fireEvent.press(toggleLimitCreditSearch)
    await fireEvent.press(toggleLimitCreditSearch)

    const maxPriceInput = getByPlaceholderText(`${MAX_PRICE}`)
    expect(maxPriceInput.props.value).toStrictEqual('15')
  })

  describe('when user is not logged in', () => {
    beforeEach(() => {
      mockedUseAuthContext.mockImplementationOnce(() => ({ isLoggedIn: false }))
    })

    it('should not display limit credit search toggle', () => {
      const { queryByTestId } = render(<SearchPrice />)

      const toggleLimitCreditSearch = queryByTestId('Interrupteur-limitCreditSearch')

      expect(toggleLimitCreditSearch).toBeFalsy()
    })
  })

  describe('when user is not a beneficiary', () => {
    beforeEach(() => {
      mockedUseUserProfileInfo.mockImplementationOnce(() => ({
        data: { isBeneficiary: false, domainsCredit: undefined },
      }))
    })

    it('should not display limit credit search toggle', () => {
      const { queryByTestId } = render(<SearchPrice />)

      const toggleLimitCreditSearch = queryByTestId('Interrupteur-limitCreditSearch')

      expect(toggleLimitCreditSearch).toBeFalsy()
    })
  })
})
