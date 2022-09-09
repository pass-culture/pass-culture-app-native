import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { useAuthContext } from 'features/auth/AuthContext'
import { useUserProfileInfo } from 'features/profile/api'
import { initialSearchState } from 'features/search/pages/reducer'
import { MAX_PRICE } from 'features/search/pages/reducer.helpers'
import { SearchPrice } from 'features/search/pages/SearchPrice'
import { SectionTitle } from 'features/search/sections/titles'
import { SearchView } from 'features/search/types'
import { analytics } from 'libs/firebase/analytics'
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

  it('should navigate on search results when pressing on search button with minimum and maximum prices entered', async () => {
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

  it('should log a search by price when pressing on search button with minimum and maximum prices entered and only free offers search toggle desactivated', async () => {
    const { getByPlaceholderText, getByText } = render(<SearchPrice />)

    const minPriceInput = getByPlaceholderText('0')
    await fireEvent(minPriceInput, 'onChangeText', '5')

    const maxPriceInput = getByPlaceholderText(`${MAX_PRICE}`)
    await fireEvent(maxPriceInput, 'onChangeText', '20')

    const searchButton = getByText('Rechercher')
    await fireEvent.press(searchButton)

    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Price)
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

  it('should reset limit credit search toggle when pressing reset button', async () => {
    const { getByTestId, getByText } = render(<SearchPrice />)

    const resetButton = getByText('Réinitialiser')
    await fireEvent.press(resetButton)

    const toggleLimitCreditSearch = getByTestId('Interrupteur-limitCreditSearch')
    expect(toggleLimitCreditSearch.props.accessibilityState.checked).toStrictEqual(false)
  })

  it('should reset only free offers search toggle when pressing reset button', async () => {
    const { getByTestId, getByText } = render(<SearchPrice />)

    const resetButton = getByText('Réinitialiser')
    await fireEvent.press(resetButton)

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    expect(toggleOnlyFreeOffersSearch.props.accessibilityState.checked).toStrictEqual(false)
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

  it('should reset the maximum price when desactivate limit credit search toggle if max price entered in the current search is the available credit', async () => {
    mockSearchState = { ...initialSearchState, maxPrice: '100' }
    const { getByTestId, getByPlaceholderText } = render(<SearchPrice />)

    const toggleLimitCreditSearch = getByTestId('Interrupteur-limitCreditSearch')
    await fireEvent.press(toggleLimitCreditSearch)

    const maxPriceInput = getByPlaceholderText(`${MAX_PRICE}`)
    expect(maxPriceInput.props.value).toStrictEqual('')
  })

  it('should update the maximum price by the max price entered in the current search if different from avaiable credit when desactivate limit credit search toggle', async () => {
    mockSearchState = { ...initialSearchState, maxPrice: '15' }
    const { getByTestId, getByPlaceholderText } = render(<SearchPrice />)

    const toggleLimitCreditSearch = getByTestId('Interrupteur-limitCreditSearch')
    await fireEvent.press(toggleLimitCreditSearch)
    await fireEvent.press(toggleLimitCreditSearch)

    const maxPriceInput = getByPlaceholderText(`${MAX_PRICE}`)
    expect(maxPriceInput.props.value).toStrictEqual('15')
  })

  it('should navigate on search results when pressing search button with only free offers search toggle activated', async () => {
    const { getByTestId, getByText } = render(<SearchPrice />)

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    await fireEvent.press(toggleOnlyFreeOffersSearch)

    const searchButton = getByText('Rechercher')
    await fireEvent.press(searchButton)

    const expectedSearchParams = {
      ...mockSearchState,
      view: SearchView.Results,
      offerIsFree: true,
      minPrice: '0',
      maxPrice: '0',
    }
    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      params: expectedSearchParams,
      screen: 'Search',
    })
  })

  it('should log a search by only free offers when pressing search button with only free offers search toggle activated', async () => {
    const { getByTestId, getByText } = render(<SearchPrice />)

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    await fireEvent.press(toggleOnlyFreeOffersSearch)

    const searchButton = getByText('Rechercher')
    await fireEvent.press(searchButton)

    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Free)
  })

  it('should navigate on search results with only free offers when pressing search button with only free offers search toggle desactivated and only maximum price entered at 0', async () => {
    const { getByPlaceholderText, getByText } = render(<SearchPrice />)

    const maxPriceInput = getByPlaceholderText(`${MAX_PRICE}`)
    await fireEvent(maxPriceInput, 'onChangeText', '0')

    const searchButton = getByText('Rechercher')
    await fireEvent.press(searchButton)

    const expectedSearchParams = {
      ...mockSearchState,
      view: SearchView.Results,
      offerIsFree: true,
      maxPrice: '0',
    }
    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      params: expectedSearchParams,
      screen: 'Search',
    })
  })

  it('should log a search by only free offers when pressing search button with only free offers search toggle desactivated and only maximum price entered at 0', async () => {
    const { getByPlaceholderText, getByText } = render(<SearchPrice />)

    const maxPriceInput = getByPlaceholderText(`${MAX_PRICE}`)
    await fireEvent(maxPriceInput, 'onChangeText', '0')

    const searchButton = getByText('Rechercher')
    await fireEvent.press(searchButton)

    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Free)
  })

  it('should desactivate limit credit search toggle when only free offers search toggle activated', async () => {
    const { getByTestId } = render(<SearchPrice />)

    const toggleLimitCreditSearch = getByTestId('Interrupteur-limitCreditSearch')
    await fireEvent.press(toggleLimitCreditSearch)
    expect(toggleLimitCreditSearch.props.accessibilityState.checked).toStrictEqual(true)

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    await fireEvent.press(toggleOnlyFreeOffersSearch)

    expect(toggleLimitCreditSearch.props.accessibilityState.checked).toStrictEqual(false)
  })

  it('should desactivate only free offers search toggle when limit credit search toggle activated', async () => {
    const { getByTestId } = render(<SearchPrice />)

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    await fireEvent.press(toggleOnlyFreeOffersSearch)
    expect(toggleOnlyFreeOffersSearch.props.accessibilityState.checked).toStrictEqual(true)

    const toggleLimitCreditSearch = getByTestId('Interrupteur-limitCreditSearch')
    await fireEvent.press(toggleLimitCreditSearch)

    expect(toggleOnlyFreeOffersSearch.props.accessibilityState.checked).toStrictEqual(false)
  })

  it('should update the minimum price by 0 when pressing only free offers search toggle', async () => {
    const { getByPlaceholderText, getByTestId } = render(<SearchPrice />)

    const minPriceInput = getByPlaceholderText('0')
    await fireEvent(minPriceInput, 'onChangeText', '5')

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    await fireEvent.press(toggleOnlyFreeOffersSearch)

    expect(minPriceInput.props.value).toStrictEqual('0')
  })

  it('should update the minimum price by empty value when desactivate only free offers search toggle if minimum price in the current search is 0', async () => {
    mockSearchState = { ...initialSearchState, minPrice: '0' }
    const { getByTestId, getByPlaceholderText } = render(<SearchPrice />)

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    await fireEvent.press(toggleOnlyFreeOffersSearch)
    await fireEvent.press(toggleOnlyFreeOffersSearch)

    const minPriceInput = getByPlaceholderText('0')

    expect(minPriceInput.props.value).toStrictEqual('')
  })

  it('should update the minimum price by minimum price in the current search when desactivate only free offers search toggle if minimum price in the current search is not 0', async () => {
    mockSearchState = { ...initialSearchState, minPrice: '5' }
    const { getByTestId, getByPlaceholderText } = render(<SearchPrice />)

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    await fireEvent.press(toggleOnlyFreeOffersSearch)
    await fireEvent.press(toggleOnlyFreeOffersSearch)

    const minPriceInput = getByPlaceholderText('0')

    expect(minPriceInput.props.value).toStrictEqual('5')
  })

  it('should update the maximum price by empty value when desactivate only free offers search toggle if maximum price in the current search is 0', async () => {
    mockSearchState = { ...initialSearchState, maxPrice: '0' }
    const { getByTestId, getByPlaceholderText } = render(<SearchPrice />)

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    await fireEvent.press(toggleOnlyFreeOffersSearch)
    await fireEvent.press(toggleOnlyFreeOffersSearch)

    const maxPriceInput = getByPlaceholderText(`${MAX_PRICE}`)

    expect(maxPriceInput.props.value).toStrictEqual('')
  })

  it('should update the maximum price by maximum price in the current search when desactivate only free offers search toggle if maximum price in the current search is not 0', async () => {
    mockSearchState = { ...initialSearchState, maxPrice: '20' }
    const { getByTestId, getByPlaceholderText } = render(<SearchPrice />)

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    await fireEvent.press(toggleOnlyFreeOffersSearch)
    await fireEvent.press(toggleOnlyFreeOffersSearch)

    const maxPriceInput = getByPlaceholderText(`${MAX_PRICE}`)

    expect(maxPriceInput.props.value).toStrictEqual('20')
  })

  it('should disable the minimum price input when pressing only free offers search toggle', async () => {
    const { getByPlaceholderText, getByTestId } = render(<SearchPrice />)

    const minPriceInput = getByPlaceholderText('0')

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    await fireEvent.press(toggleOnlyFreeOffersSearch)

    expect(minPriceInput.props.disabled).toStrictEqual(true)
  })

  it('should update the maximum price by 0 when pressing only free offers search toggle', async () => {
    const { getByPlaceholderText, getByTestId } = render(<SearchPrice />)

    const maxPriceInput = getByPlaceholderText(`${MAX_PRICE}`)
    await fireEvent(maxPriceInput, 'onChangeText', '0')

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    await fireEvent.press(toggleOnlyFreeOffersSearch)

    expect(maxPriceInput.props.value).toStrictEqual('0')
  })

  it('should disable the maximum price input when pressing only free offers search toggle', async () => {
    const { getByPlaceholderText, getByTestId } = render(<SearchPrice />)

    const maxPriceInput = getByPlaceholderText(`${MAX_PRICE}`)

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    await fireEvent.press(toggleOnlyFreeOffersSearch)

    expect(maxPriceInput.props.disabled).toStrictEqual(true)
  })

  it('should display credit banner with remaining credit of the user', () => {
    const { queryByText } = render(<SearchPrice />)

    const creditBanner = queryByText('Il te reste 100 € sur ton pass Culture.')

    expect(creditBanner).toBeTruthy()
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

    it('should not display credit banner', () => {
      const { queryByTestId } = render(<SearchPrice />)

      const creditBanner = queryByTestId('creditBanner')

      expect(creditBanner).toBeFalsy()
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

    it('should not display credit banner', () => {
      const { queryByTestId } = render(<SearchPrice />)

      const creditBanner = queryByTestId('creditBanner')

      expect(creditBanner).toBeFalsy()
    })
  })
})
