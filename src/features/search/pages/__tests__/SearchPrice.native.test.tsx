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
import { fireEvent, render, act } from 'tests/utils'

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
      domainsCredit: { all: { initial: 8000, remaining: 7000 } },
    },
  })),
}))

const mockedUseAuthContext = useAuthContext as jest.Mock
jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

jest.mock('react-query')

const mockHideModal = jest.fn()

describe('SearchPrice component', () => {
  it('should render correctly', () => {
    expect(renderSearchPrice()).toMatchSnapshot()
  })

  it('should navigate on search results when pressing on search button with minimum and maximum prices entered', async () => {
    const { getByPlaceholderText, getByText } = renderSearchPrice()

    const minPriceInput = getByPlaceholderText('0')
    await act(async () => {
      fireEvent(minPriceInput, 'onChangeText', '5')
    })

    const maxPriceInput = getByPlaceholderText('80')
    await act(async () => {
      fireEvent(maxPriceInput, 'onChangeText', '20')
    })

    const searchButton = getByText('Rechercher')
    await act(async () => {
      fireEvent.press(searchButton)
    })

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
    const { getByPlaceholderText, getByText } = renderSearchPrice()

    const minPriceInput = getByPlaceholderText('0')
    await act(async () => {
      fireEvent(minPriceInput, 'onChangeText', '5')
    })

    const maxPriceInput = getByPlaceholderText('80')
    await act(async () => {
      fireEvent(maxPriceInput, 'onChangeText', '20')
    })

    const searchButton = getByText('Rechercher')
    await act(async () => {
      fireEvent.press(searchButton)
    })

    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Price)
  })

  describe('without previous value in the search state', () => {
    it('should reset minimum price when pressing reset button', async () => {
      const { getByPlaceholderText, getByText } = renderSearchPrice()

      const minPriceInput = getByPlaceholderText('0')
      await act(async () => {
        fireEvent(minPriceInput, 'onChangeText', '5')
      })

      const resetButton = getByText('Réinitialiser')
      await act(async () => {
        fireEvent.press(resetButton)
      })

      expect(minPriceInput.props.value).toStrictEqual('')
    })

    it('should reset maximum price when pressing reset button', async () => {
      const { getByPlaceholderText, getByText } = renderSearchPrice()

      const maxPriceInput = getByPlaceholderText('80')
      await act(async () => {
        fireEvent(maxPriceInput, 'onChangeText', '20')
      })

      const resetButton = getByText('Réinitialiser')
      await act(async () => {
        fireEvent.press(resetButton)
      })

      expect(maxPriceInput.props.value).toStrictEqual('')
    })

    it('should reset limit credit search toggle when pressing reset button', () => {
      const { getByTestId, getByText } = renderSearchPrice()

      const resetButton = getByText('Réinitialiser')
      fireEvent.press(resetButton)

      const toggleLimitCreditSearch = getByTestId('Interrupteur-limitCreditSearch')
      expect(toggleLimitCreditSearch.props.accessibilityState.checked).toStrictEqual(false)
    })

    it('should reset only free offers search toggle when pressing reset button', () => {
      const { getByTestId, getByText } = renderSearchPrice()

      const resetButton = getByText('Réinitialiser')
      fireEvent.press(resetButton)

      const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
      expect(toggleOnlyFreeOffersSearch.props.accessibilityState.checked).toStrictEqual(false)
    })
  })

  describe('with previous value in the search state', () => {
    it('should reset minimum price when pressing reset button', async () => {
      mockSearchState = { ...initialSearchState, minPrice: '5' }
      const { getByPlaceholderText, getByText } = renderSearchPrice()

      const minPriceInput = getByPlaceholderText('0')

      const resetButton = getByText('Réinitialiser')
      await act(async () => {
        fireEvent.press(resetButton)
      })

      expect(minPriceInput.props.value).toStrictEqual('')
    })

    it('should preserve minimum price when closing the modal', () => {
      mockSearchState = { ...initialSearchState, minPrice: '5' }
      const { getByPlaceholderText, getByTestId } = renderSearchPrice()

      const minPriceInput = getByPlaceholderText('0')

      const previousButton = getByTestId('backButton')
      fireEvent.press(previousButton)

      expect(minPriceInput.props.value).toStrictEqual('5')
    })

    it('should reset maximum price when pressing reset button', async () => {
      mockSearchState = { ...initialSearchState, maxPrice: '15' }
      const { getByPlaceholderText, getByText } = renderSearchPrice()

      const maxPriceInput = getByPlaceholderText('80')

      const resetButton = getByText('Réinitialiser')
      await act(async () => {
        fireEvent.press(resetButton)
      })

      expect(maxPriceInput.props.value).toStrictEqual('')
    })

    it('should preserve maximum price when closing the modal', () => {
      mockSearchState = { ...initialSearchState, maxPrice: '15' }
      const { getByPlaceholderText, getByTestId } = renderSearchPrice()

      const maxPriceInput = getByPlaceholderText('80')

      const previousButton = getByTestId('backButton')
      fireEvent.press(previousButton)

      expect(maxPriceInput.props.value).toStrictEqual('15')
    })

    it('should reset limit credit search toggle when pressing reset button', () => {
      mockSearchState = { ...initialSearchState, maxPrice: '70' }
      const { getByTestId, getByText } = renderSearchPrice()

      const resetButton = getByText('Réinitialiser')
      fireEvent.press(resetButton)

      const toggleLimitCreditSearch = getByTestId('Interrupteur-limitCreditSearch')
      expect(toggleLimitCreditSearch.props.accessibilityState.checked).toStrictEqual(false)
    })

    it('should preserve limit credit search toggle when closing the modal', () => {
      mockSearchState = { ...initialSearchState, maxPrice: '70' }
      const { getByTestId } = renderSearchPrice()

      const previousButton = getByTestId('backButton')
      fireEvent.press(previousButton)

      const toggleLimitCreditSearch = getByTestId('Interrupteur-limitCreditSearch')
      expect(toggleLimitCreditSearch.props.accessibilityState.checked).toStrictEqual(true)
    })

    it('should reset only free offers search toggle when pressing reset button', () => {
      mockSearchState = { ...initialSearchState, offerIsFree: true }
      const { getByTestId, getByText } = renderSearchPrice()

      const resetButton = getByText('Réinitialiser')
      fireEvent.press(resetButton)

      const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
      expect(toggleOnlyFreeOffersSearch.props.accessibilityState.checked).toStrictEqual(false)
    })

    it('should preserve limit credit search toggle when closing the modal', () => {
      mockSearchState = { ...initialSearchState, offerIsFree: true }
      const { getByTestId } = renderSearchPrice()

      const previousButton = getByTestId('backButton')
      fireEvent.press(previousButton)

      const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
      expect(toggleOnlyFreeOffersSearch.props.accessibilityState.checked).toStrictEqual(true)
    })
  })

  it('should update the maximum price when activate limit credit search toggle', async () => {
    const { getByTestId, getByPlaceholderText } = renderSearchPrice()

    const toggleLimitCreditSearch = getByTestId('Interrupteur-limitCreditSearch')
    await act(async () => {
      fireEvent.press(toggleLimitCreditSearch)
    })

    const maxPriceInput = getByPlaceholderText('80')
    expect(maxPriceInput.props.value).toStrictEqual('70')
  })

  it('should disable the maximum price input when activate limit credit search toggle', async () => {
    const { getByTestId, getByPlaceholderText } = renderSearchPrice()

    const toggleLimitCreditSearch = getByTestId('Interrupteur-limitCreditSearch')
    await act(async () => {
      fireEvent.press(toggleLimitCreditSearch)
    })

    const maxPriceInput = getByPlaceholderText('80')
    expect(maxPriceInput.props.disabled).toStrictEqual(true)
  })

  it('should reset the maximum price when desactivate limit credit search toggle and no max price entered in the current search', async () => {
    const { getByTestId, getByPlaceholderText } = renderSearchPrice()

    const toggleLimitCreditSearch = getByTestId('Interrupteur-limitCreditSearch')
    await act(async () => {
      fireEvent.press(toggleLimitCreditSearch)
    })
    await act(async () => {
      fireEvent.press(toggleLimitCreditSearch)
    })

    const maxPriceInput = getByPlaceholderText('80')
    expect(maxPriceInput.props.value).toStrictEqual('')
  })

  it('should reset the maximum price when desactivate limit credit search toggle if max price entered in the current search is the available credit', async () => {
    mockSearchState = { ...initialSearchState, maxPrice: '70' }
    const { getByTestId, getByPlaceholderText } = renderSearchPrice()

    const toggleLimitCreditSearch = getByTestId('Interrupteur-limitCreditSearch')
    await act(async () => {
      fireEvent.press(toggleLimitCreditSearch)
    })

    const maxPriceInput = getByPlaceholderText('80')
    expect(maxPriceInput.props.value).toStrictEqual('')
  })

  it('should update the maximum price by the max price entered in the current search if different from avaiable credit when desactivate limit credit search toggle', async () => {
    mockSearchState = { ...initialSearchState, maxPrice: '15' }
    const { getByTestId, getByPlaceholderText } = renderSearchPrice()

    const toggleLimitCreditSearch = getByTestId('Interrupteur-limitCreditSearch')
    await act(async () => {
      fireEvent.press(toggleLimitCreditSearch)
    })
    await act(async () => {
      fireEvent.press(toggleLimitCreditSearch)
    })

    const maxPriceInput = getByPlaceholderText('80')
    expect(maxPriceInput.props.value).toStrictEqual('15')
  })

  it('should navigate on search results when pressing search button with only free offers search toggle activated', async () => {
    const { getByTestId, getByText } = renderSearchPrice()

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    await act(async () => {
      fireEvent.press(toggleOnlyFreeOffersSearch)
    })

    const searchButton = getByText('Rechercher')
    await act(async () => {
      fireEvent.press(searchButton)
    })

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
    const { getByTestId, getByText } = renderSearchPrice()

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    await act(async () => {
      fireEvent.press(toggleOnlyFreeOffersSearch)
    })

    const searchButton = getByText('Rechercher')
    await act(async () => {
      fireEvent.press(searchButton)
    })

    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Free)
  })

  it('should navigate on search results with only free offers when pressing search button with only free offers search toggle desactivated and only maximum price entered at 0', async () => {
    const { getByPlaceholderText, getByText } = renderSearchPrice()

    const maxPriceInput = getByPlaceholderText('80')
    await act(async () => {
      fireEvent(maxPriceInput, 'onChangeText', '0')
    })

    const searchButton = getByText('Rechercher')
    await act(async () => {
      fireEvent.press(searchButton)
    })

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
    const { getByPlaceholderText, getByText } = renderSearchPrice()

    const maxPriceInput = getByPlaceholderText('80')
    await act(async () => {
      fireEvent(maxPriceInput, 'onChangeText', '0')
    })

    const searchButton = getByText('Rechercher')
    await act(async () => {
      fireEvent.press(searchButton)
    })

    expect(analytics.logUseFilter).toHaveBeenCalledWith(SectionTitle.Free)
  })

  it('should desactivate limit credit search toggle when only free offers search toggle activated', async () => {
    const { getByTestId } = renderSearchPrice()

    const toggleLimitCreditSearch = getByTestId('Interrupteur-limitCreditSearch')
    await act(async () => {
      fireEvent.press(toggleLimitCreditSearch)
    })
    expect(toggleLimitCreditSearch.props.accessibilityState.checked).toStrictEqual(true)

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    await act(async () => {
      fireEvent.press(toggleOnlyFreeOffersSearch)
    })

    expect(toggleLimitCreditSearch.props.accessibilityState.checked).toStrictEqual(false)
  })

  it('should desactivate only free offers search toggle when limit credit search toggle activated', async () => {
    const { getByTestId } = renderSearchPrice()

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    await act(async () => {
      fireEvent.press(toggleOnlyFreeOffersSearch)
    })
    expect(toggleOnlyFreeOffersSearch.props.accessibilityState.checked).toStrictEqual(true)

    const toggleLimitCreditSearch = getByTestId('Interrupteur-limitCreditSearch')
    await act(async () => {
      fireEvent.press(toggleLimitCreditSearch)
    })

    expect(toggleOnlyFreeOffersSearch.props.accessibilityState.checked).toStrictEqual(false)
  })

  it('should update the minimum price by 0 when pressing only free offers search toggle', async () => {
    const { getByPlaceholderText, getByTestId } = renderSearchPrice()

    const minPriceInput = getByPlaceholderText('0')
    await act(async () => {
      fireEvent(minPriceInput, 'onChangeText', '5')
    })

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    await act(async () => {
      fireEvent.press(toggleOnlyFreeOffersSearch)
    })

    expect(minPriceInput.props.value).toStrictEqual('0')
  })

  it('should update the minimum price by empty value when desactivate only free offers search toggle if minimum price in the current search is 0', async () => {
    mockSearchState = { ...initialSearchState, minPrice: '0' }
    const { getByTestId, getByPlaceholderText } = renderSearchPrice()

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    await act(async () => {
      fireEvent.press(toggleOnlyFreeOffersSearch)
    })
    await act(async () => {
      fireEvent.press(toggleOnlyFreeOffersSearch)
    })

    const minPriceInput = getByPlaceholderText('0')

    expect(minPriceInput.props.value).toStrictEqual('')
  })

  it('should update the minimum price by minimum price in the current search when desactivate only free offers search toggle if minimum price in the current search is not 0', async () => {
    mockSearchState = { ...initialSearchState, minPrice: '5' }
    const { getByTestId, getByPlaceholderText } = renderSearchPrice()

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    await act(async () => {
      fireEvent.press(toggleOnlyFreeOffersSearch)
    })
    await act(async () => {
      fireEvent.press(toggleOnlyFreeOffersSearch)
    })

    const minPriceInput = getByPlaceholderText('0')

    expect(minPriceInput.props.value).toStrictEqual('5')
  })

  it('should update the maximum price by empty value when desactivate only free offers search toggle if maximum price in the current search is 0', async () => {
    mockSearchState = { ...initialSearchState, maxPrice: '0' }
    const { getByTestId, getByPlaceholderText } = renderSearchPrice()

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    await act(async () => {
      fireEvent.press(toggleOnlyFreeOffersSearch)
    })
    await act(async () => {
      fireEvent.press(toggleOnlyFreeOffersSearch)
    })

    const maxPriceInput = getByPlaceholderText('80')

    expect(maxPriceInput.props.value).toStrictEqual('')
  })

  it('should update the maximum price by maximum price in the current search when desactivate only free offers search toggle if maximum price in the current search is not 0', async () => {
    mockSearchState = { ...initialSearchState, maxPrice: '20' }
    const { getByTestId, getByPlaceholderText } = renderSearchPrice()

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    await act(async () => {
      fireEvent.press(toggleOnlyFreeOffersSearch)
    })
    await act(async () => {
      fireEvent.press(toggleOnlyFreeOffersSearch)
    })

    const maxPriceInput = getByPlaceholderText('80')

    expect(maxPriceInput.props.value).toStrictEqual('20')
  })

  it('should disable the minimum price input when pressing only free offers search toggle', async () => {
    const { getByPlaceholderText, getByTestId } = renderSearchPrice()

    const minPriceInput = getByPlaceholderText('0')

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    await act(async () => {
      fireEvent.press(toggleOnlyFreeOffersSearch)
    })

    expect(minPriceInput.props.disabled).toStrictEqual(true)
  })

  it('should update the maximum price by 0 when pressing only free offers search toggle', async () => {
    const { getByPlaceholderText, getByTestId } = renderSearchPrice()

    const maxPriceInput = getByPlaceholderText('80')
    await act(async () => {
      fireEvent(maxPriceInput, 'onChangeText', '0')
    })

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    await act(async () => {
      fireEvent.press(toggleOnlyFreeOffersSearch)
    })

    expect(maxPriceInput.props.value).toStrictEqual('0')
  })

  it('should disable the maximum price input when pressing only free offers search toggle', async () => {
    const { getByPlaceholderText, getByTestId } = renderSearchPrice()

    const maxPriceInput = getByPlaceholderText('80')

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    await act(async () => {
      fireEvent.press(toggleOnlyFreeOffersSearch)
    })

    expect(maxPriceInput.props.disabled).toStrictEqual(true)
  })

  it('should display credit banner with remaining credit of the user', () => {
    const { queryByText } = renderSearchPrice()

    const creditBanner = queryByText('Il te reste 70 € sur ton pass Culture.')

    expect(creditBanner).toBeTruthy()
  })

  it('should display an error when the expected format of minimum price is incorrect', async () => {
    const { getByPlaceholderText, getByText } = renderSearchPrice()

    const minPriceInput = getByPlaceholderText('0')
    await act(async () => {
      fireEvent(minPriceInput, 'onChangeText', '10,559')
    })
    const inputError = getByText(`Format du prix incorrect. Exemple de format attendu\u00a0: 10,00`)

    expect(inputError).toBeTruthy()
  })

  it('should display an error when the expected format of maximum price is incorrect', async () => {
    const { getByPlaceholderText, getByText } = renderSearchPrice()

    const maxPriceInput = getByPlaceholderText('80')
    await act(async () => {
      fireEvent(maxPriceInput, 'onChangeText', '10,559')
    })
    const inputError = getByText(`Format du prix incorrect. Exemple de format attendu\u00a0: 10,00`)

    expect(inputError).toBeTruthy()
  })

  it('should display the initial credit in maximum price input placeholder', () => {
    const { getByPlaceholderText } = renderSearchPrice()

    const maxPriceInput = getByPlaceholderText('80')

    expect(maxPriceInput).toBeTruthy()
  })

  it('should display the initial credit in right label maximum price input', () => {
    const { getByText } = renderSearchPrice()

    const rightLabelMaxInput = getByText(`max : 80 €`)

    expect(rightLabelMaxInput).toBeTruthy()
  })

  describe('should close the modal ', () => {
    it('when pressing the search button', async () => {
      const { getByText } = renderSearchPrice()

      const searchButton = getByText('Rechercher')
      await act(async () => {
        fireEvent.press(searchButton)
      })

      expect(mockHideModal).toHaveBeenCalled()
    })

    it('when pressing previous button', async () => {
      const { getByTestId } = renderSearchPrice()

      const previousButton = getByTestId('backButton')
      fireEvent.press(previousButton)

      expect(mockHideModal).toHaveBeenCalled()
    })
  })

  it('should hide minPrice and maxPrice errors when onlyFreeOffers is pressed', async () => {
    const { queryByText, getByPlaceholderText, getByTestId } = renderSearchPrice()

    const minPriceInput = getByPlaceholderText('0')
    const maxPriceInput = getByPlaceholderText('80')
    const onlyFreeOffersToggle = getByTestId('Interrupteur-onlyFreeOffers')

    await act(async () => {
      fireEvent(minPriceInput, 'onChangeText', '9999')
      fireEvent(maxPriceInput, 'onChangeText', '9999')
    })

    expect(queryByText('Le prix indiqué ne doit pas dépasser 80\u00a0€')).toBeTruthy()

    await act(async () => {
      fireEvent.press(onlyFreeOffersToggle)
    })

    expect(queryByText('Le prix indiqué ne doit pas dépasser 80\u00a0€')).toBeFalsy()
  })

  it('should hide maxPrice error when limitCreditSearch is pressed', async () => {
    const { queryByText, getByPlaceholderText, getByTestId } = renderSearchPrice()

    const maxPriceInput = getByPlaceholderText('80')
    const limitCreditSearchToggle = getByTestId('Interrupteur-limitCreditSearch')

    await act(async () => {
      fireEvent(maxPriceInput, 'onChangeText', '9999')
    })

    expect(queryByText('Le prix indiqué ne doit pas dépasser 80\u00a0€')).toBeTruthy()

    await act(async () => {
      fireEvent.press(limitCreditSearchToggle)
    })

    expect(queryByText('Le prix indiqué ne doit pas dépasser 80\u00a0€')).toBeFalsy()
  })

  describe('when user is not logged in', () => {
    beforeEach(() => {
      mockedUseUserProfileInfo.mockImplementationOnce(() => ({
        data: {},
      }))
      mockedUseAuthContext.mockImplementationOnce(() => ({ isLoggedIn: false }))
    })

    it('should not display limit credit search toggle', () => {
      const { queryByTestId } = renderSearchPrice()

      const toggleLimitCreditSearch = queryByTestId('Interrupteur-limitCreditSearch')

      expect(toggleLimitCreditSearch).toBeFalsy()
    })

    it('should not display credit banner', () => {
      const { queryByTestId } = renderSearchPrice()

      const creditBanner = queryByTestId('creditBanner')

      expect(creditBanner).toBeFalsy()
    })

    it('should display the credit given to 18 year olds in maximum price input placeholder', () => {
      const { getByPlaceholderText } = renderSearchPrice()

      const maxPriceInput = getByPlaceholderText(`${MAX_PRICE}`)

      expect(maxPriceInput).toBeTruthy()
    })

    it('should display the credit given to 18 year olds in right label maximum price input', () => {
      const { getByText } = renderSearchPrice()

      const rightLabelMaxInput = getByText(`max : ${MAX_PRICE} €`)

      expect(rightLabelMaxInput).toBeTruthy()
    })
  })

  describe('when user is not a beneficiary', () => {
    beforeEach(() => {
      mockedUseUserProfileInfo.mockImplementationOnce(() => ({
        data: { isBeneficiary: false, domainsCredit: undefined },
      }))
    })

    it('should not display limit credit search toggle', () => {
      const { queryByTestId } = renderSearchPrice()

      const toggleLimitCreditSearch = queryByTestId('Interrupteur-limitCreditSearch')

      expect(toggleLimitCreditSearch).toBeFalsy()
    })

    it('should not display credit banner', () => {
      const { queryByTestId } = renderSearchPrice()

      const creditBanner = queryByTestId('creditBanner')

      expect(creditBanner).toBeFalsy()
    })

    it('should display the credit given to 18 year olds in maximum price input placeholder', () => {
      const { getByPlaceholderText } = renderSearchPrice()

      const maxPriceInput = getByPlaceholderText(`${MAX_PRICE}`)

      expect(maxPriceInput).toBeTruthy()
    })

    it('should display the credit given to 18 year olds in right label maximum price input', () => {
      const { getByText } = renderSearchPrice()

      const rightLabelMaxInput = getByText(`max : ${MAX_PRICE} €`)

      expect(rightLabelMaxInput).toBeTruthy()
    })
  })
})

function renderSearchPrice() {
  return render(
    <SearchPrice
      title="Prix"
      accessibilityLabel="Ne pas filtrer sur les prix et retourner aux résultats"
      isVisible={true}
      hideModal={mockHideModal}
    />
  )
}
