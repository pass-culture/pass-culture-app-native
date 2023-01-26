import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate } from '__mocks__/@react-navigation/native'
import * as Auth from 'features/auth/context/AuthContext'
import { initialSearchState } from 'features/search/context/reducer'
import { FilterBehaviour } from 'features/search/enums'
import { MAX_PRICE } from 'features/search/helpers/reducer.helpers'
import { SearchState, SearchView } from 'features/search/types'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, act, superFlushWithAct, waitFor } from 'tests/utils'

import { PriceModal, PriceModalProps } from './PriceModal'

const searchId = uuidv4()
const searchState: SearchState = { ...initialSearchState, searchId }
let mockSearchState = searchState
const mockDispatch = jest.fn()

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

const mockedUseAuthContext = jest.spyOn(Auth, 'useAuthContext').mockReturnValue({
  isLoggedIn: true,
  user: { ...beneficiaryUser, domainsCredit: { all: { initial: 8000, remaining: 7000 } } },
  isUserLoading: false,
  refetchUser: jest.fn(),
  setIsLoggedIn: jest.fn(),
}) as jest.Mock

jest.mock('react-query')

const mockHideModal = jest.fn()
const mockOnClose = jest.fn()

describe('<PriceModal/>', () => {
  beforeAll(() => {
    mockSearchState = { ...searchState, searchId }
  })

  it('should render modal correctly after animation and with enabled submit', async () => {
    jest.useFakeTimers()
    const renderAPI = renderSearchPrice()
    await superFlushWithAct()
    jest.advanceTimersByTime(2000)
    expect(renderAPI).toMatchSnapshot()
    jest.useRealTimers()
  })

  describe('should navigate on search results ', () => {
    it('when pressing on search button with minimum and maximum prices entered', async () => {
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

    it('when pressing on search button with minimum and maximum prices entered at 0', async () => {
      const { getByPlaceholderText, getByText } = renderSearchPrice()

      const minPriceInput = getByPlaceholderText('0')
      await act(async () => {
        fireEvent(minPriceInput, 'onChangeText', '0')
      })

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
        minPrice: '0',
        maxPrice: '0',
        offerIsFree: true,
        view: SearchView.Results,
      }
      expect(navigate).toHaveBeenCalledWith('TabNavigator', {
        params: expectedSearchParams,
        screen: 'Search',
      })
    })

    it('when pressing search button with only free offers search toggle activated', async () => {
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

    it('with only free offers when pressing search button with only free offers search toggle desactivated and only maximum price entered at 0', async () => {
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

    it('with only a minimum price', async () => {
      const { getByPlaceholderText, getByText } = renderSearchPrice()

      const minPriceInput = getByPlaceholderText('0')
      await act(async () => {
        fireEvent(minPriceInput, 'onChangeText', '1')
      })

      const searchButton = getByText('Rechercher')
      await act(async () => {
        fireEvent.press(searchButton)
      })

      const expectedSearchParams = {
        ...mockSearchState,
        view: SearchView.Results,
        minPrice: '1',
        maxPossiblePrice: '80',
      }
      expect(navigate).toHaveBeenCalledWith('TabNavigator', {
        params: expectedSearchParams,
        screen: 'Search',
      })
    })
  })

  it('should log PerformSearch when pressing search button', async () => {
    const { getByText } = renderSearchPrice()

    await superFlushWithAct()

    const button = getByText('Rechercher')
    await act(async () => {
      fireEvent.press(button)
    })

    expect(analytics.logPerformSearch).toHaveBeenCalledWith({
      ...mockSearchState,
      maxPossiblePrice: '80',
      view: SearchView.Results,
    })
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

    it('should reset limit credit search toggle when pressing reset button', async () => {
      const { getByTestId, getByText } = renderSearchPrice()

      const resetButton = getByText('Réinitialiser')
      fireEvent.press(resetButton)

      await waitFor(() => {
        const toggleLimitCreditSearch = getByTestId('Interrupteur-limitCreditSearch')
        expect(toggleLimitCreditSearch.props.accessibilityState.checked).toStrictEqual(false)
      })
    })

    it('should reset only free offers search toggle when pressing reset button', async () => {
      const { getByTestId, getByText } = renderSearchPrice()

      const resetButton = getByText('Réinitialiser')
      fireEvent.press(resetButton)

      await waitFor(() => {
        const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
        expect(toggleOnlyFreeOffersSearch.props.accessibilityState.checked).toStrictEqual(false)
      })
    })
  })

  describe('with previous value in the search state', () => {
    it('should reset minimum price when pressing reset button', async () => {
      mockSearchState = { ...searchState, minPrice: '5' }
      const { getByPlaceholderText, getByText } = renderSearchPrice()

      const minPriceInput = getByPlaceholderText('0')

      const resetButton = getByText('Réinitialiser')
      fireEvent.press(resetButton)

      await waitFor(() => {
        expect(minPriceInput.props.value).toStrictEqual('')
      })
    })

    it('should preserve minimum price when closing the modal', async () => {
      mockSearchState = { ...searchState, minPrice: '5' }
      const { getByPlaceholderText, getByTestId } = renderSearchPrice()

      const minPriceInput = getByPlaceholderText('0')

      const previousButton = getByTestId('Fermer')
      fireEvent.press(previousButton)

      await waitFor(() => {
        expect(minPriceInput.props.value).toStrictEqual('5')
      })
    })

    it('should reset maximum price when pressing reset button', async () => {
      mockSearchState = { ...searchState, maxPrice: '15' }
      const { getByPlaceholderText, getByText } = renderSearchPrice()

      const maxPriceInput = getByPlaceholderText('80')

      const resetButton = getByText('Réinitialiser')
      fireEvent.press(resetButton)

      await waitFor(() => {
        expect(maxPriceInput.props.value).toStrictEqual('')
      })
    })

    it('should preserve maximum price when closing the modal', async () => {
      mockSearchState = { ...searchState, maxPrice: '15' }
      const { getByPlaceholderText, getByTestId } = renderSearchPrice()

      const maxPriceInput = getByPlaceholderText('80')

      const previousButton = getByTestId('Fermer')
      fireEvent.press(previousButton)

      await waitFor(() => {
        expect(maxPriceInput.props.value).toStrictEqual('15')
      })
    })

    it('should reset limit credit search toggle when pressing reset button', async () => {
      mockSearchState = { ...searchState, maxPrice: '70' }
      const { getByTestId, getByText } = renderSearchPrice()

      const resetButton = getByText('Réinitialiser')
      fireEvent.press(resetButton)

      const toggleLimitCreditSearch = getByTestId('Interrupteur-limitCreditSearch')
      await waitFor(() => {
        expect(toggleLimitCreditSearch.props.accessibilityState.checked).toStrictEqual(false)
      })
    })

    it('should preserve limit credit search toggle when closing the modal', async () => {
      mockSearchState = { ...searchState, maxPrice: '70' }
      const { getByTestId } = renderSearchPrice()

      const previousButton = getByTestId('Fermer')
      fireEvent.press(previousButton)

      const toggleLimitCreditSearch = getByTestId('Interrupteur-limitCreditSearch')
      await waitFor(() => {
        expect(toggleLimitCreditSearch.props.accessibilityState.checked).toStrictEqual(true)
      })
    })

    it('should reset only free offers search toggle when pressing reset button', async () => {
      mockSearchState = { ...searchState, offerIsFree: true }
      const { getByTestId, getByText } = renderSearchPrice()

      const resetButton = getByText('Réinitialiser')
      fireEvent.press(resetButton)

      const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
      await waitFor(() => {
        expect(toggleOnlyFreeOffersSearch.props.accessibilityState.checked).toStrictEqual(false)
      })
    })

    it('should preserve only free offers search toggle when closing the modal', async () => {
      mockSearchState = { ...searchState, offerIsFree: true }
      const { getByTestId } = renderSearchPrice()

      const previousButton = getByTestId('Fermer')
      fireEvent.press(previousButton)

      const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
      await waitFor(() => {
        expect(toggleOnlyFreeOffersSearch.props.accessibilityState.checked).toStrictEqual(true)
      })
    })
  })

  it('should update the maximum price when activate limit credit search toggle', async () => {
    const { getByTestId, getByPlaceholderText } = renderSearchPrice()

    const toggleLimitCreditSearch = getByTestId('Interrupteur-limitCreditSearch')
    fireEvent.press(toggleLimitCreditSearch)

    const maxPriceInput = getByPlaceholderText('80')
    await waitFor(() => {
      expect(maxPriceInput.props.value).toStrictEqual('70')
    })
  })

  it('should disable the maximum price input when activate limit credit search toggle', async () => {
    const { getByTestId, getByPlaceholderText } = renderSearchPrice()

    const toggleLimitCreditSearch = getByTestId('Interrupteur-limitCreditSearch')
    fireEvent.press(toggleLimitCreditSearch)

    const maxPriceInput = getByPlaceholderText('80')
    await waitFor(() => {
      expect(maxPriceInput.props.disabled).toStrictEqual(true)
    })
  })

  it('should reset the maximum price when desactivate limit credit search toggle and no max price entered in the current search', async () => {
    const { getByTestId, getByPlaceholderText } = renderSearchPrice()

    const toggleLimitCreditSearch = getByTestId('Interrupteur-limitCreditSearch')
    fireEvent.press(toggleLimitCreditSearch)
    fireEvent.press(toggleLimitCreditSearch)

    const maxPriceInput = getByPlaceholderText('80')
    await waitFor(() => {
      expect(maxPriceInput.props.value).toStrictEqual('')
    })
  })

  it('should reset the maximum price when desactivate limit credit search toggle if max price entered in the current search is the available credit', async () => {
    mockSearchState = { ...searchState, maxPrice: '70' }
    const { getByTestId, getByPlaceholderText } = renderSearchPrice()

    const toggleLimitCreditSearch = getByTestId('Interrupteur-limitCreditSearch')
    fireEvent.press(toggleLimitCreditSearch)

    const maxPriceInput = getByPlaceholderText('80')
    await waitFor(() => {
      expect(maxPriceInput.props.value).toStrictEqual('')
    })
  })

  it('should update the maximum price by the max price entered in the current search if different from avaiable credit when desactivate limit credit search toggle', async () => {
    mockSearchState = { ...searchState, maxPrice: '15' }
    const { getByTestId, getByPlaceholderText } = renderSearchPrice()

    const toggleLimitCreditSearch = getByTestId('Interrupteur-limitCreditSearch')
    fireEvent.press(toggleLimitCreditSearch)
    fireEvent.press(toggleLimitCreditSearch)

    const maxPriceInput = getByPlaceholderText('80')
    await waitFor(() => {
      expect(maxPriceInput.props.value).toStrictEqual('15')
    })
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
    fireEvent(minPriceInput, 'onChangeText', '5')

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    fireEvent.press(toggleOnlyFreeOffersSearch)

    await waitFor(() => {
      expect(minPriceInput.props.value).toStrictEqual('0')
    })
  })

  it('should update the minimum price by empty value when desactivate only free offers search toggle if minimum price in the current search is 0', async () => {
    mockSearchState = { ...searchState, minPrice: '0' }
    const { getByTestId, getByPlaceholderText } = renderSearchPrice()

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    fireEvent.press(toggleOnlyFreeOffersSearch)
    fireEvent.press(toggleOnlyFreeOffersSearch)

    const minPriceInput = getByPlaceholderText('0')

    await waitFor(() => {
      expect(minPriceInput.props.value).toStrictEqual('')
    })
  })

  it('should update the minimum price by minimum price in the current search when desactivate only free offers search toggle if minimum price in the current search is not 0', async () => {
    mockSearchState = { ...searchState, minPrice: '5' }
    const { getByTestId, getByPlaceholderText } = renderSearchPrice()

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    fireEvent.press(toggleOnlyFreeOffersSearch)
    fireEvent.press(toggleOnlyFreeOffersSearch)

    const minPriceInput = getByPlaceholderText('0')

    await waitFor(() => {
      expect(minPriceInput.props.value).toStrictEqual('5')
    })
  })

  it('should update the maximum price by empty value when desactivate only free offers search toggle if maximum price in the current search is 0', async () => {
    mockSearchState = { ...searchState, maxPrice: '0' }
    const { getByTestId, getByPlaceholderText } = renderSearchPrice()

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    fireEvent.press(toggleOnlyFreeOffersSearch)
    fireEvent.press(toggleOnlyFreeOffersSearch)

    const maxPriceInput = getByPlaceholderText('80')

    await waitFor(() => {
      expect(maxPriceInput.props.value).toStrictEqual('')
    })
  })

  it('should update the maximum price by maximum price in the current search when desactivate only free offers search toggle if maximum price in the current search is not 0', async () => {
    mockSearchState = { ...searchState, maxPrice: '20' }
    const { getByTestId, getByPlaceholderText } = renderSearchPrice()

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    fireEvent.press(toggleOnlyFreeOffersSearch)
    fireEvent.press(toggleOnlyFreeOffersSearch)

    const maxPriceInput = getByPlaceholderText('80')

    await waitFor(() => {
      expect(maxPriceInput.props.value).toStrictEqual('20')
    })
  })

  it('should disable the minimum price input when pressing only free offers search toggle', async () => {
    const { getByPlaceholderText, getByTestId } = renderSearchPrice()

    const minPriceInput = getByPlaceholderText('0')

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    fireEvent.press(toggleOnlyFreeOffersSearch)

    await waitFor(() => {
      expect(minPriceInput.props.disabled).toStrictEqual(true)
    })
  })

  it('should update the maximum price by 0 when pressing only free offers search toggle', async () => {
    const { getByPlaceholderText, getByTestId } = renderSearchPrice()

    const maxPriceInput = getByPlaceholderText('80')
    fireEvent(maxPriceInput, 'onChangeText', '0')

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    fireEvent.press(toggleOnlyFreeOffersSearch)

    await waitFor(() => {
      expect(maxPriceInput.props.value).toStrictEqual('0')
    })
  })

  it('should disable the maximum price input when pressing only free offers search toggle', async () => {
    const { getByPlaceholderText, getByTestId } = renderSearchPrice()

    const maxPriceInput = getByPlaceholderText('80')

    const toggleOnlyFreeOffersSearch = getByTestId('Interrupteur-onlyFreeOffers')
    fireEvent.press(toggleOnlyFreeOffersSearch)

    await waitFor(() => {
      expect(maxPriceInput.props.disabled).toStrictEqual(true)
    })
  })

  it('should display credit banner with remaining credit of the user', async () => {
    const { queryByText } = renderSearchPrice()

    const creditBanner = queryByText('Il te reste 70 € sur ton pass Culture.')

    await waitFor(() => {
      expect(creditBanner).toBeTruthy()
    })
  })

  it('should display an error when the expected format of minimum price is incorrect', async () => {
    const { getByPlaceholderText, getByText } = renderSearchPrice()

    const minPriceInput = getByPlaceholderText('0')
    fireEvent(minPriceInput, 'onChangeText', '10,559')

    await waitFor(() => {
      const inputError = getByText(
        `Format du prix incorrect. Exemple de format attendu\u00a0: 10,00`
      )
      expect(inputError).toBeTruthy()
    })
  })

  it('should display an error when the expected format of maximum price is incorrect', async () => {
    const { getByPlaceholderText, getByText } = renderSearchPrice()

    const maxPriceInput = getByPlaceholderText('80')
    fireEvent(maxPriceInput, 'onChangeText', '10,559')

    await waitFor(() => {
      const inputError = getByText(
        `Format du prix incorrect. Exemple de format attendu\u00a0: 10,00`
      )
      expect(inputError).toBeTruthy()
    })
  })

  it('should display the initial credit in maximum price input placeholder', async () => {
    const { getByPlaceholderText } = renderSearchPrice()

    const maxPriceInput = getByPlaceholderText('80')
    await waitFor(() => {
      expect(maxPriceInput).toBeTruthy()
    })
  })

  it('should display the initial credit in right label maximum price input', async () => {
    const { getByText } = renderSearchPrice()

    const rightLabelMaxInput = getByText(`max : 80 €`)

    await waitFor(() => {
      expect(rightLabelMaxInput).toBeTruthy()
    })
  })

  describe('should close the modal ', () => {
    it('when pressing the search button', async () => {
      const { getByTestId } = renderSearchPrice()

      await superFlushWithAct()

      const searchButton = getByTestId('Rechercher')

      await act(async () => {
        fireEvent.press(searchButton)
      })

      expect(mockHideModal).toHaveBeenCalledTimes(1)
    })

    it('when pressing previous button', async () => {
      const { getByTestId } = renderSearchPrice()

      await superFlushWithAct()

      const previousButton = getByTestId('Fermer')
      fireEvent.press(previousButton)

      expect(mockHideModal).toHaveBeenCalledTimes(1)
    })
  })

  it('should hide minPrice error when onlyFreeOffers is pressed', async () => {
    const { queryByText, getByPlaceholderText, getByTestId } = renderSearchPrice()

    const minPriceInput = getByPlaceholderText('0')
    const onlyFreeOffersToggle = getByTestId('Interrupteur-onlyFreeOffers')

    await act(async () => {
      fireEvent(minPriceInput, 'onChangeText', '9999')
    })

    expect(queryByText('Le prix indiqué ne doit pas dépasser 80\u00a0€')).toBeTruthy()

    await act(async () => {
      fireEvent.press(onlyFreeOffersToggle)
    })

    expect(queryByText('Le prix indiqué ne doit pas dépasser 80\u00a0€')).toBeFalsy()
  })

  it('should hide maxPrice error when onlyFreeOffers is pressed', async () => {
    const { queryByText, getByPlaceholderText, getByTestId } = renderSearchPrice()

    const maxPriceInput = getByPlaceholderText('80')
    const onlyFreeOffersToggle = getByTestId('Interrupteur-onlyFreeOffers')

    await act(async () => {
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
      mockedUseAuthContext.mockImplementation(() => ({ user: undefined, isLoggedIn: false }))
    })

    it('should not display limit credit search toggle', async () => {
      const { queryByTestId } = renderSearchPrice()

      await superFlushWithAct()

      const toggleLimitCreditSearch = queryByTestId('Interrupteur-limitCreditSearch')

      expect(toggleLimitCreditSearch).toBeFalsy()
    })

    it('should not display credit banner', async () => {
      const { queryByTestId } = renderSearchPrice()

      const creditBanner = queryByTestId('creditBanner')
      await waitFor(() => {
        expect(creditBanner).toBeFalsy()
      })
    })

    it('should display the credit given to 18 year olds in maximum price input placeholder', async () => {
      const { getByPlaceholderText } = renderSearchPrice()

      const maxPriceInput = getByPlaceholderText(`${MAX_PRICE}`)

      await waitFor(() => {
        expect(maxPriceInput).toBeTruthy()
      })
    })

    it('should display the credit given to 18 year olds in right label maximum price input', async () => {
      const { getByText } = renderSearchPrice()

      const rightLabelMaxInput = getByText(`max : ${MAX_PRICE} €`)

      await waitFor(() => {
        expect(rightLabelMaxInput).toBeTruthy()
      })
    })
  })

  describe('when user is not a beneficiary', () => {
    beforeEach(() => {
      mockedUseAuthContext.mockImplementation(() => ({
        user: { isBeneficiary: false, domainsCredit: undefined },
        isLoggedIn: true,
      }))
    })

    it('should not display limit credit search toggle', async () => {
      const { queryByTestId } = renderSearchPrice()

      const toggleLimitCreditSearch = queryByTestId('Interrupteur-limitCreditSearch')

      await waitFor(() => {
        expect(toggleLimitCreditSearch).toBeFalsy()
      })
    })

    it('should not display credit banner', async () => {
      const { queryByTestId } = renderSearchPrice()

      const creditBanner = queryByTestId('creditBanner')

      await waitFor(() => {
        expect(creditBanner).toBeFalsy()
      })
    })

    it('should display the credit given to 18 year olds in maximum price input placeholder', async () => {
      const { getByPlaceholderText } = renderSearchPrice()

      const maxPriceInput = getByPlaceholderText(`${MAX_PRICE}`)

      await waitFor(() => {
        expect(maxPriceInput).toBeTruthy()
      })
    })

    it('should display the credit given to 18 year olds in right label maximum price input', async () => {
      const { getByText } = renderSearchPrice()

      const rightLabelMaxInput = getByText(`max : ${MAX_PRICE} €`)

      await waitFor(() => {
        expect(rightLabelMaxInput).toBeTruthy()
      })
    })
  })

  describe('with "Appliquer le filtre" button', () => {
    it('should display alternative button title', async () => {
      const { getByText } = renderSearchPrice({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })

      await waitFor(() => {
        expect(getByText('Appliquer le filtre')).toBeTruthy()
      })
    })

    it('should update search state when pressing submit button', async () => {
      const { getByText, getByPlaceholderText } = renderSearchPrice({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })

      await superFlushWithAct()

      const maxPriceInput = getByPlaceholderText('300')
      await act(async () => {
        fireEvent(maxPriceInput, 'onChangeText', '50')
      })

      const searchButton = getByText('Appliquer le filtre')

      await act(async () => {
        fireEvent.press(searchButton)
      })

      const expectedSearchParams: SearchState = {
        ...searchState,
        maxPrice: '50',
        view: SearchView.Results,
      }

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: expectedSearchParams,
      })
    })
  })

  describe('Modal header buttons', () => {
    it('should display back button on header when the modal is opening from general filter page', async () => {
      const { getByTestId } = renderSearchPrice({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })

      await waitFor(() => {
        expect(getByTestId('Revenir en arrière')).toBeTruthy()
      })
    })

    it('should close the modal and general filter page when pressing close button when the modal is opening from general filter page', async () => {
      const { getByTestId } = renderSearchPrice({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
        onClose: mockOnClose,
      })

      await superFlushWithAct()

      const closeButton = getByTestId('Fermer')
      fireEvent.press(closeButton)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should only close the modal when pressing close button when the modal is opening from search results', async () => {
      const { getByTestId } = renderSearchPrice()

      await superFlushWithAct()

      const closeButton = getByTestId('Fermer')
      fireEvent.press(closeButton)

      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })
})

function renderSearchPrice({
  filterBehaviour = FilterBehaviour.SEARCH,
  onClose,
}: Partial<PriceModalProps> = {}) {
  return render(
    <PriceModal
      title="Prix"
      accessibilityLabel="Ne pas filtrer sur les prix et retourner aux résultats"
      isVisible
      hideModal={mockHideModal}
      filterBehaviour={filterBehaviour}
      onClose={onClose}
    />
  )
}
