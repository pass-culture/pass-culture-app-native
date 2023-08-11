import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate } from '__mocks__/@react-navigation/native'
import * as Auth from 'features/auth/context/AuthContext'
import { initialSearchState } from 'features/search/context/reducer'
import { FilterBehaviour } from 'features/search/enums'
import { MAX_PRICE } from 'features/search/helpers/reducer.helpers'
import { SearchState, SearchView } from 'features/search/types'
import { beneficiaryUser } from 'fixtures/user'
import { fireEvent, render, act, waitFor, screen } from 'tests/utils'

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

  afterEach(() => {
    mockedUseAuthContext.mockImplementation(() => ({
      user: { ...beneficiaryUser, domainsCredit: { all: { initial: 8000, remaining: 7000 } } },
      isLoggedIn: true,
    }))
  })

  it('should render modal correctly after animation and with enabled submit', async () => {
    renderSearchPrice()

    const searchButton = await screen.findByLabelText('Rechercher')
    expect(searchButton).toBeEnabled()

    expect(screen).toMatchSnapshot()
  })

  describe('without previous value in the search state', () => {
    it('should reset minimum price when pressing reset button', async () => {
      renderSearchPrice()

      const minPriceInput = screen.getByPlaceholderText('0')
      fireEvent.changeText(minPriceInput, '5')

      const resetButton = screen.getByText('Réinitialiser')
      await act(async () => fireEvent.press(resetButton))

      expect(minPriceInput.props.value).toStrictEqual('')
    })

    it('should reset maximum price when pressing reset button', async () => {
      renderSearchPrice()

      const maxPriceInput = screen.getByPlaceholderText('80')
      fireEvent.changeText(maxPriceInput, '20')

      const resetButton = screen.getByText('Réinitialiser')
      await act(async () => fireEvent.press(resetButton))

      expect(maxPriceInput.props.value).toStrictEqual('')
    })

    it('should reset limit credit search toggle when pressing reset button', async () => {
      renderSearchPrice()

      const resetButton = screen.getByText('Réinitialiser')
      await act(async () => fireEvent.press(resetButton))

      const toggleLimitCreditSearch = screen.getByTestId('Interrupteur limitCreditSearch')
      expect(toggleLimitCreditSearch.props.accessibilityState.checked).toStrictEqual(false)
    })

    it('should reset only free offers search toggle when pressing reset button', async () => {
      renderSearchPrice()

      const resetButton = screen.getByText('Réinitialiser')
      await act(async () => fireEvent.press(resetButton))

      const toggleOnlyFreeOffersSearch = screen.getByTestId('Interrupteur onlyFreeOffers')
      expect(toggleOnlyFreeOffersSearch.props.accessibilityState.checked).toStrictEqual(false)
    })
  })

  describe('with previous value in the search state', () => {
    it('should reset minimum price when pressing reset button', async () => {
      mockSearchState = { ...searchState, minPrice: '5' }
      renderSearchPrice()

      const minPriceInput = screen.getByPlaceholderText('0')

      const resetButton = screen.getByText('Réinitialiser')
      await act(async () => fireEvent.press(resetButton))

      expect(minPriceInput.props.value).toStrictEqual('')
    })

    it('should preserve minimum price when closing the modal', async () => {
      mockSearchState = { ...searchState, minPrice: '5' }
      renderSearchPrice()

      const minPriceInput = screen.getByPlaceholderText('0')

      const previousButton = screen.getByTestId('Fermer')
      await act(async () => fireEvent.press(previousButton))

      expect(minPriceInput.props.value).toStrictEqual('5')
    })

    it('should reset maximum price when pressing reset button', async () => {
      mockSearchState = { ...searchState, maxPrice: '15' }
      renderSearchPrice()

      const maxPriceInput = screen.getByPlaceholderText('80')

      const resetButton = screen.getByText('Réinitialiser')
      await act(async () => fireEvent.press(resetButton))

      expect(maxPriceInput.props.value).toStrictEqual('')
    })

    it('should preserve maximum price when closing the modal', async () => {
      mockSearchState = { ...searchState, maxPrice: '15' }
      renderSearchPrice()

      const maxPriceInput = screen.getByPlaceholderText('80')

      const previousButton = screen.getByTestId('Fermer')
      await act(async () => fireEvent.press(previousButton))

      expect(maxPriceInput.props.value).toStrictEqual('15')
    })

    it('should reset limit credit search toggle when pressing reset button', async () => {
      mockSearchState = { ...searchState, maxPrice: '70' }
      renderSearchPrice()

      const resetButton = screen.getByText('Réinitialiser')
      await act(async () => fireEvent.press(resetButton))

      const toggleLimitCreditSearch = screen.getByTestId('Interrupteur limitCreditSearch')
      expect(toggleLimitCreditSearch.props.accessibilityState.checked).toStrictEqual(false)
    })

    it('should preserve limit credit search toggle when closing the modal', async () => {
      mockSearchState = { ...searchState, maxPrice: '70' }
      renderSearchPrice()

      const previousButton = screen.getByTestId('Fermer')
      await act(async () => fireEvent.press(previousButton))

      const toggleLimitCreditSearch = screen.getByTestId('Interrupteur limitCreditSearch')
      expect(toggleLimitCreditSearch.props.accessibilityState.checked).toStrictEqual(true)
    })

    it('should reset only free offers search toggle when pressing reset button', async () => {
      mockSearchState = { ...searchState, offerIsFree: true }
      renderSearchPrice()

      const resetButton = screen.getByText('Réinitialiser')
      await act(async () => fireEvent.press(resetButton))

      const toggleOnlyFreeOffersSearch = screen.getByTestId('Interrupteur onlyFreeOffers')
      expect(toggleOnlyFreeOffersSearch.props.accessibilityState.checked).toStrictEqual(false)
    })

    it('should preserve only free offers search toggle when closing the modal', async () => {
      mockSearchState = { ...searchState, offerIsFree: true }
      renderSearchPrice()

      const previousButton = screen.getByTestId('Fermer')
      await act(async () => fireEvent.press(previousButton))

      const toggleOnlyFreeOffersSearch = screen.getByTestId('Interrupteur onlyFreeOffers')

      expect(toggleOnlyFreeOffersSearch.props.accessibilityState.checked).toStrictEqual(true)
    })
  })

  it('should update the maximum price when activate limit credit search toggle', async () => {
    renderSearchPrice()

    const toggleLimitCreditSearch = screen.getByTestId('Interrupteur limitCreditSearch')
    await act(async () => fireEvent.press(toggleLimitCreditSearch))

    const maxPriceInput = screen.getByPlaceholderText('80')

    expect(maxPriceInput.props.value).toStrictEqual('70')
  })

  it('should disable the maximum price input when activate limit credit search toggle', async () => {
    renderSearchPrice()

    const toggleLimitCreditSearch = screen.getByTestId('Interrupteur limitCreditSearch')
    await act(async () => fireEvent.press(toggleLimitCreditSearch))

    const maxPriceInput = screen.getByPlaceholderText('80')

    expect(maxPriceInput.props.disabled).toStrictEqual(true)
  })

  it('should reset the maximum price when desactivate limit credit search toggle and no max price entered in the current search', async () => {
    renderSearchPrice()

    const toggleLimitCreditSearch = screen.getByTestId('Interrupteur limitCreditSearch')
    fireEvent.press(toggleLimitCreditSearch)
    await act(async () => fireEvent.press(toggleLimitCreditSearch))

    const maxPriceInput = screen.getByPlaceholderText('80')
    expect(maxPriceInput.props.value).toStrictEqual('')
  })

  it('should reset the maximum price when desactivate limit credit search toggle if max price entered in the current search is the available credit', async () => {
    mockSearchState = { ...searchState, maxPrice: '70' }
    renderSearchPrice()

    const toggleLimitCreditSearch = screen.getByTestId('Interrupteur limitCreditSearch')
    await act(async () => fireEvent.press(toggleLimitCreditSearch))

    const maxPriceInput = screen.getByPlaceholderText('80')
    expect(maxPriceInput.props.value).toStrictEqual('')
  })

  it('should update the maximum price by the max price entered in the current search if different from avaiable credit when desactivate limit credit search toggle', async () => {
    mockSearchState = { ...searchState, maxPrice: '15' }
    renderSearchPrice()

    const toggleLimitCreditSearch = screen.getByTestId('Interrupteur limitCreditSearch')
    fireEvent.press(toggleLimitCreditSearch)
    await act(async () => fireEvent.press(toggleLimitCreditSearch))

    const maxPriceInput = screen.getByPlaceholderText('80')
    expect(maxPriceInput.props.value).toStrictEqual('15')
  })

  it('should desactivate limit credit search toggle when only free offers search toggle activated', async () => {
    renderSearchPrice()

    const toggleLimitCreditSearch = screen.getByTestId('Interrupteur limitCreditSearch')
    await act(async () => fireEvent.press(toggleLimitCreditSearch))
    expect(toggleLimitCreditSearch.props.accessibilityState.checked).toStrictEqual(true)

    const toggleOnlyFreeOffersSearch = screen.getByTestId('Interrupteur onlyFreeOffers')
    await act(async () => fireEvent.press(toggleOnlyFreeOffersSearch))

    expect(toggleLimitCreditSearch.props.accessibilityState.checked).toStrictEqual(false)
  })

  it('should desactivate only free offers search toggle when limit credit search toggle activated', async () => {
    renderSearchPrice()

    const toggleOnlyFreeOffersSearch = screen.getByTestId('Interrupteur onlyFreeOffers')
    await act(async () => fireEvent.press(toggleOnlyFreeOffersSearch))
    expect(toggleOnlyFreeOffersSearch.props.accessibilityState.checked).toStrictEqual(true)

    const toggleLimitCreditSearch = screen.getByTestId('Interrupteur limitCreditSearch')
    await act(async () => fireEvent.press(toggleLimitCreditSearch))

    expect(toggleOnlyFreeOffersSearch.props.accessibilityState.checked).toStrictEqual(false)
  })

  it('should update the minimum price by 0 when pressing only free offers search toggle', async () => {
    renderSearchPrice()

    const minPriceInput = screen.getByPlaceholderText('0')
    fireEvent.changeText(minPriceInput, '5')

    const toggleOnlyFreeOffersSearch = screen.getByTestId('Interrupteur onlyFreeOffers')
    await act(async () => fireEvent.press(toggleOnlyFreeOffersSearch))

    expect(minPriceInput.props.value).toStrictEqual('0')
  })

  it('should update the minimum price by empty value when desactivate only free offers search toggle if minimum price in the current search is 0', async () => {
    mockSearchState = { ...searchState, minPrice: '0' }
    renderSearchPrice()

    const toggleOnlyFreeOffersSearch = screen.getByTestId('Interrupteur onlyFreeOffers')
    fireEvent.press(toggleOnlyFreeOffersSearch)
    await act(async () => fireEvent.press(toggleOnlyFreeOffersSearch))

    const minPriceInput = screen.getByPlaceholderText('0')

    expect(minPriceInput.props.value).toStrictEqual('')
  })

  it('should update the minimum price by minimum price in the current search when desactivate only free offers search toggle if minimum price in the current search is not 0', async () => {
    mockSearchState = { ...searchState, minPrice: '5' }
    renderSearchPrice()

    const toggleOnlyFreeOffersSearch = screen.getByTestId('Interrupteur onlyFreeOffers')
    fireEvent.press(toggleOnlyFreeOffersSearch)
    await act(async () => fireEvent.press(toggleOnlyFreeOffersSearch))

    const minPriceInput = screen.getByPlaceholderText('0')

    expect(minPriceInput.props.value).toStrictEqual('5')
  })

  it('should update the maximum price by empty value when desactivate only free offers search toggle if maximum price in the current search is 0', async () => {
    mockSearchState = { ...searchState, maxPrice: '0' }
    renderSearchPrice()

    const toggleOnlyFreeOffersSearch = screen.getByTestId('Interrupteur onlyFreeOffers')
    fireEvent.press(toggleOnlyFreeOffersSearch)
    await act(async () => fireEvent.press(toggleOnlyFreeOffersSearch))

    const maxPriceInput = screen.getByPlaceholderText('80')

    expect(maxPriceInput.props.value).toStrictEqual('')
  })

  it('should update the maximum price by maximum price in the current search when desactivate only free offers search toggle if maximum price in the current search is not 0', async () => {
    mockSearchState = { ...searchState, maxPrice: '20' }
    renderSearchPrice()

    const toggleOnlyFreeOffersSearch = screen.getByTestId('Interrupteur onlyFreeOffers')
    fireEvent.press(toggleOnlyFreeOffersSearch)
    await act(async () => fireEvent.press(toggleOnlyFreeOffersSearch))

    const maxPriceInput = screen.getByPlaceholderText('80')

    expect(maxPriceInput.props.value).toStrictEqual('20')
  })

  it('should disable the minimum price input when pressing only free offers search toggle', async () => {
    renderSearchPrice()

    const minPriceInput = screen.getByPlaceholderText('0')

    const toggleOnlyFreeOffersSearch = screen.getByTestId('Interrupteur onlyFreeOffers')
    await act(async () => fireEvent.press(toggleOnlyFreeOffersSearch))

    expect(minPriceInput.props.disabled).toStrictEqual(true)
  })

  it('should update the maximum price by 0 when pressing only free offers search toggle', async () => {
    renderSearchPrice()

    const maxPriceInput = screen.getByPlaceholderText('80')
    fireEvent.changeText(maxPriceInput, '0')

    const toggleOnlyFreeOffersSearch = screen.getByTestId('Interrupteur onlyFreeOffers')
    await act(async () => fireEvent.press(toggleOnlyFreeOffersSearch))

    expect(maxPriceInput.props.value).toStrictEqual('0')
  })

  it('should disable the maximum price input when pressing only free offers search toggle', async () => {
    renderSearchPrice()

    const maxPriceInput = screen.getByPlaceholderText('80')

    const toggleOnlyFreeOffersSearch = screen.getByTestId('Interrupteur onlyFreeOffers')
    await act(async () => fireEvent.press(toggleOnlyFreeOffersSearch))

    expect(maxPriceInput.props.disabled).toStrictEqual(true)
  })

  it('should display credit banner with remaining credit of the user', async () => {
    renderSearchPrice()

    await waitFor(() => {
      expect(screen.getByText('Rechercher')).toBeEnabled()
    })

    const creditBanner = screen.queryByText('Il te reste 70 € sur ton pass Culture.')

    await waitFor(() => {
      expect(creditBanner).toBeTruthy()
    })
  })

  it('should display an error when the expected format of minimum price is incorrect', async () => {
    renderSearchPrice()

    const minPriceInput = screen.getByPlaceholderText('0')
    await act(async () => fireEvent.changeText(minPriceInput, '10,559'))

    const inputError = screen.getByText(
      `Format du prix incorrect. Exemple de format attendu\u00a0: 10,00`
    )
    expect(inputError).toBeTruthy()
  })

  it('should display an error when the expected format of maximum price is incorrect', async () => {
    renderSearchPrice()

    const maxPriceInput = screen.getByPlaceholderText('80')
    await act(async () => fireEvent.changeText(maxPriceInput, '10,559'))

    const inputError = screen.getByText(
      `Format du prix incorrect. Exemple de format attendu\u00a0: 10,00`
    )
    expect(inputError).toBeTruthy()
  })

  it('should display the initial credit in maximum price input placeholder', async () => {
    renderSearchPrice()

    await waitFor(() => {
      expect(screen.getByText('Rechercher')).toBeEnabled()
    })

    const maxPriceInput = screen.getByPlaceholderText('80')
    expect(maxPriceInput).toBeTruthy()
  })

  it('should display the initial credit in right label maximum price input', async () => {
    renderSearchPrice()

    await waitFor(() => {
      expect(screen.getByText('Rechercher')).toBeEnabled()
    })

    const rightLabelMaxInput = screen.getByText(`max : 80 €`)
    expect(rightLabelMaxInput).toBeTruthy()
  })

  describe('should close the modal ', () => {
    it('when pressing the search button', async () => {
      renderSearchPrice()

      const searchButton = screen.getByTestId('Rechercher')

      await waitFor(() => {
        expect(searchButton).toBeEnabled()
      })

      await act(async () => fireEvent.press(searchButton))

      expect(mockHideModal).toHaveBeenCalledTimes(1)
    })

    it('when pressing previous button', async () => {
      renderSearchPrice()

      await waitFor(() => {
        expect(screen.getByText('Rechercher')).toBeEnabled()
      })

      const previousButton = screen.getByTestId('Fermer')
      fireEvent.press(previousButton)

      expect(mockHideModal).toHaveBeenCalledTimes(1)
    })
  })

  it('should hide minPrice error when onlyFreeOffers is pressed', async () => {
    renderSearchPrice()

    const minPriceInput = screen.getByPlaceholderText('0')
    const onlyFreeOffersToggle = screen.getByTestId('Interrupteur onlyFreeOffers')

    await act(async () => fireEvent.changeText(minPriceInput, '9999'))

    expect(screen.queryByText('Le prix indiqué ne doit pas dépasser 80\u00a0€')).toBeTruthy()

    await act(async () => fireEvent.press(onlyFreeOffersToggle))

    expect(screen.queryByText('Le prix indiqué ne doit pas dépasser 80\u00a0€')).toBeNull()
  })

  it('should hide maxPrice error when onlyFreeOffers is pressed', async () => {
    renderSearchPrice()

    const maxPriceInput = screen.getByPlaceholderText('80')
    const onlyFreeOffersToggle = screen.getByTestId('Interrupteur onlyFreeOffers')

    await act(async () => fireEvent.changeText(maxPriceInput, '9999'))

    expect(screen.queryByText('Le prix indiqué ne doit pas dépasser 80\u00a0€')).toBeTruthy()

    await act(async () => fireEvent.press(onlyFreeOffersToggle))

    expect(screen.queryByText('Le prix indiqué ne doit pas dépasser 80\u00a0€')).toBeNull()
  })

  it('should hide maxPrice error when limitCreditSearch is pressed', async () => {
    renderSearchPrice()

    const maxPriceInput = screen.getByPlaceholderText('80')
    const limitCreditSearchToggle = screen.getByTestId('Interrupteur limitCreditSearch')

    await act(async () => fireEvent.changeText(maxPriceInput, '9999'))

    expect(screen.queryByText('Le prix indiqué ne doit pas dépasser 80\u00a0€')).toBeTruthy()

    await act(async () => fireEvent.press(limitCreditSearchToggle))

    expect(screen.queryByText('Le prix indiqué ne doit pas dépasser 80\u00a0€')).toBeNull()
  })

  describe('when user is not logged in', () => {
    beforeEach(() => {
      mockedUseAuthContext.mockImplementation(() => ({ user: undefined, isLoggedIn: false }))
    })

    it('should not display limit credit search toggle', async () => {
      renderSearchPrice()

      await waitFor(() => {
        expect(screen.getByText('Rechercher')).toBeEnabled()
      })

      const toggleLimitCreditSearch = screen.queryByTestId('Interrupteur limitCreditSearch')

      expect(toggleLimitCreditSearch).toBeNull()
    })

    it('should not display credit banner', async () => {
      renderSearchPrice()

      await waitFor(() => {
        expect(screen.getByText('Rechercher')).toBeEnabled()
      })

      const creditBanner = screen.queryByTestId('creditBanner')
      expect(creditBanner).toBeNull()
    })

    it('should display the credit given to 18 year olds in maximum price input placeholder', async () => {
      renderSearchPrice()

      await waitFor(() => {
        expect(screen.getByText('Rechercher')).toBeEnabled()
      })

      const maxPriceInput = screen.getByPlaceholderText(`${MAX_PRICE}`)

      expect(maxPriceInput).toBeTruthy()
    })

    it('should display the credit given to 18 year olds in right label maximum price input', async () => {
      renderSearchPrice()

      await waitFor(() => {
        expect(screen.getByText('Rechercher')).toBeEnabled()
      })

      const rightLabelMaxInput = screen.getByText(`max : ${MAX_PRICE} €`)

      expect(rightLabelMaxInput).toBeTruthy()
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
      renderSearchPrice()

      await waitFor(() => {
        expect(screen.getByText('Rechercher')).toBeEnabled()
      })

      const toggleLimitCreditSearch = screen.queryByTestId('Interrupteur limitCreditSearch')
      expect(toggleLimitCreditSearch).toBeNull()
    })

    it('should not display credit banner', async () => {
      renderSearchPrice()

      await waitFor(() => {
        expect(screen.getByText('Rechercher')).toBeEnabled()
      })

      const creditBanner = screen.queryByTestId('creditBanner')

      expect(creditBanner).toBeNull()
    })

    it('should display the credit given to 18 year olds in maximum price input placeholder', async () => {
      renderSearchPrice()

      await waitFor(() => {
        expect(screen.getByText('Rechercher')).toBeEnabled()
      })

      const maxPriceInput = screen.getByPlaceholderText(`${MAX_PRICE}`)

      expect(maxPriceInput).toBeTruthy()
    })

    it('should display the credit given to 18 year olds in right label maximum price input', async () => {
      renderSearchPrice()

      await waitFor(() => {
        expect(screen.getByText('Rechercher')).toBeEnabled()
      })

      const rightLabelMaxInput = screen.getByText(`max : ${MAX_PRICE} €`)

      expect(rightLabelMaxInput).toBeTruthy()
    })
  })

  describe('with "Appliquer le filtre" button', () => {
    it('should display alternative button title', async () => {
      renderSearchPrice({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })

      await waitFor(() => {
        expect(screen.getByText('Appliquer le filtre')).toBeTruthy()
        expect(screen.getByText('Appliquer le filtre')).toBeEnabled()
      })
    })

    it('should update search state when pressing submit button', async () => {
      renderSearchPrice({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })

      const maxPriceInput = screen.getByPlaceholderText('80')
      fireEvent.changeText(maxPriceInput, '50')

      await waitFor(() => {
        expect(screen.getByText('Appliquer le filtre')).toBeEnabled()
      })

      const searchButton = screen.getByText('Appliquer le filtre')
      await act(async () => fireEvent.press(searchButton))

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

  describe('with "Rechercher" button', () => {
    describe('should navigate on search results ', () => {
      it('when pressing button with minimum and maximum prices entered', async () => {
        renderSearchPrice()

        const minPriceInput = screen.getByPlaceholderText('0')
        await act(async () => fireEvent.changeText(minPriceInput, '5'))

        const maxPriceInput = screen.getByPlaceholderText('80')
        await act(async () => fireEvent.changeText(maxPriceInput, '20'))

        const searchButton = screen.getByText('Rechercher')
        await act(async () => fireEvent.press(searchButton))

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

      it('when pressing button with minimum and maximum prices entered at 0', async () => {
        renderSearchPrice()

        const minPriceInput = screen.getByPlaceholderText('0')
        await act(async () => fireEvent.changeText(minPriceInput, '0'))

        const maxPriceInput = screen.getByPlaceholderText('80')
        await act(async () => fireEvent.changeText(maxPriceInput, '0'))

        const searchButton = screen.getByText('Rechercher')
        await act(async () => fireEvent.press(searchButton))

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

      it('when pressing button with only free offers search toggle activated', async () => {
        renderSearchPrice()

        const toggleOnlyFreeOffersSearch = screen.getByTestId('Interrupteur onlyFreeOffers')
        await act(async () => fireEvent.press(toggleOnlyFreeOffersSearch))

        const searchButton = screen.getByText('Rechercher')
        await act(async () => fireEvent.press(searchButton))

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

      it('with only free offers when pressing button with only free offers search toggle desactivated and only maximum price entered at 0', async () => {
        renderSearchPrice()

        const maxPriceInput = screen.getByPlaceholderText('80')
        await act(async () => fireEvent.changeText(maxPriceInput, '0'))

        const searchButton = screen.getByText('Rechercher')
        await act(async () => fireEvent.press(searchButton))

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
        renderSearchPrice()

        const minPriceInput = screen.getByPlaceholderText('0')
        await act(async () => fireEvent.changeText(minPriceInput, '1'))

        const searchButton = screen.getByText('Rechercher')
        await act(async () => fireEvent.press(searchButton))

        const expectedSearchParams = {
          ...mockSearchState,
          view: SearchView.Results,
          minPrice: '1',
        }
        expect(navigate).toHaveBeenCalledWith('TabNavigator', {
          params: expectedSearchParams,
          screen: 'Search',
        })
      })
    })
  })

  describe('Modal header buttons', () => {
    it('should display back button on header when the modal is opening from general filter page', async () => {
      renderSearchPrice({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })

      await waitFor(() => {
        expect(screen.getByText('Appliquer le filtre')).toBeEnabled()
      })

      expect(screen.getByTestId('Revenir en arrière')).toBeTruthy()
    })

    it('should close the modal and general filter page when pressing close button when the modal is opening from general filter page', async () => {
      renderSearchPrice({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
        onClose: mockOnClose,
      })

      await waitFor(() => {
        expect(screen.getByText('Appliquer le filtre')).toBeEnabled()
      })

      const closeButton = screen.getByTestId('Fermer')
      fireEvent.press(closeButton)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should only close the modal when pressing close button when the modal is opening from search results', async () => {
      renderSearchPrice()

      await waitFor(() => {
        expect(screen.getByText('Rechercher')).toBeEnabled()
      })

      const closeButton = screen.getByTestId('Fermer')
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
