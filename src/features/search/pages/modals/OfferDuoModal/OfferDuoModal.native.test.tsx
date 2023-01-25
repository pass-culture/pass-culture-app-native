import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate } from '__mocks__/@react-navigation/native'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { initialSearchState } from 'features/search/context/reducer'
import { FilterBehaviour } from 'features/search/enums'
import {
  OfferDuoModal,
  OfferDuoModalProps,
} from 'features/search/pages/modals/OfferDuoModal/OfferDuoModal'
import { SearchState, SearchView } from 'features/search/types'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, superFlushWithAct, waitFor } from 'tests/utils'

const searchId = uuidv4()
const searchState = { ...initialSearchState, searchId }
const mockSearchState = searchState
const mockDispatch = jest.fn()

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

jest.mock('features/auth/context/AuthContext')
const mockUser = { ...beneficiaryUser, domainsCredit: { all: { initial: 8000, remaining: 7000 } } }
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

mockUseAuthContext.mockReturnValue({
  isLoggedIn: true,
  setIsLoggedIn: jest.fn(),
  user: mockUser,
  refetchUser: jest.fn(),
  isUserLoading: false,
})

const mockHideModal = jest.fn()
const mockOnClose = jest.fn()

describe('<OfferDuoModal/>', () => {
  it('should render modal correctly after animation and with enabled submit', async () => {
    jest.useFakeTimers()
    const renderAPI = renderOfferDuoModal()
    await superFlushWithAct()
    jest.advanceTimersByTime(2000)
    expect(renderAPI).toMatchSnapshot()
    jest.useRealTimers()
  })

  describe('modal header', () => {
    it('should have header when viewport width is mobile', () => {
      const isDesktopViewport = false
      const renderAPI = renderOfferDuoModal({}, isDesktopViewport)

      const header = renderAPI.queryByTestId('pageHeader')
      expect(header).toBeTruthy()
    })

    it('should not have header when viewport width is desktop', () => {
      const isDesktopViewport = true
      const renderAPI = renderOfferDuoModal({}, isDesktopViewport)

      const header = renderAPI.queryByTestId('pageHeader')
      expect(header).toBeFalsy()
    })

    describe('Buttons', () => {
      it('should display back button on header when the modal is opening from general filter page', async () => {
        const { getByTestId } = renderOfferDuoModal({
          filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
        })

        await waitFor(() => {
          expect(getByTestId('Revenir en arrière')).toBeTruthy()
        })
      })

      it('should close the modal and general filter page when pressing close button when the modal is opening from general filter page', async () => {
        const { getByTestId } = renderOfferDuoModal({
          filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
          onClose: mockOnClose,
        })

        const closeButton = getByTestId('Fermer')
        fireEvent.press(closeButton)

        expect(mockOnClose).toHaveBeenCalledTimes(1)
      })

      it('should only close the modal when pressing close button when the modal is opening from search results', async () => {
        const { getByTestId } = renderOfferDuoModal()

        const closeButton = getByTestId('Fermer')
        fireEvent.press(closeButton)

        expect(mockOnClose).not.toHaveBeenCalled()
      })
    })
  })

  describe('when user is logged in and beneficiary with credit', () => {
    beforeEach(() => {
      mockUseAuthContext.mockReturnValueOnce({
        isLoggedIn: false,
        setIsLoggedIn: jest.fn(),
        user: beneficiaryUser,
        refetchUser: jest.fn(),
        isUserLoading: false,
      })
    })

    it('should toggle offerIsDuo', () => {
      const renderAPI = renderOfferDuoModal()

      const toggle = renderAPI.getByTestId('Interrupteur-limitDuoOfferSearch')

      expect(toggle.props.accessibilityState).toEqual({
        disabled: false,
        checked: false,
      })

      fireEvent.press(toggle)

      expect(toggle.props.accessibilityState).toEqual({
        disabled: false,
        checked: true,
      })
    })
  })

  describe('click reset button', () => {
    it('should disable duo offer when click on reset button', () => {
      const renderAPI = renderOfferDuoModal()

      const toggle = renderAPI.getByTestId('Interrupteur-limitDuoOfferSearch')

      fireEvent.press(toggle)

      const resetButton = renderAPI.getByText('Réinitialiser')

      fireEvent.press(resetButton)

      expect(toggle.props.accessibilityState).toEqual({
        disabled: false,
        checked: false,
      })
    })
  })

  describe('should close the modal ', () => {
    it('should close modal on submit', async () => {
      const { getByText } = renderOfferDuoModal()
      const button = getByText('Rechercher')

      fireEvent.press(button)

      await waitFor(() => {
        expect(mockHideModal).toHaveBeenCalledTimes(1)
      })
    })

    it('should navigate to Search results when selecting DUO offer and submit form', async () => {
      const { getByText, getByTestId } = renderOfferDuoModal()
      const toggle = getByTestId('Interrupteur-limitDuoOfferSearch')
      const button = getByText('Rechercher')

      fireEvent.press(toggle)

      fireEvent.press(button)

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('TabNavigator', {
          params: {
            ...mockSearchState,
            view: SearchView.Results,
            offerIsDuo: true,
          },
          screen: 'Search',
        })
      })
    })

    it('should use default filters when submitting without change', async () => {
      const { getByText } = renderOfferDuoModal()

      const button = getByText('Rechercher')

      fireEvent.press(button)

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('TabNavigator', {
          params: {
            ...mockSearchState,
            view: SearchView.Results,
            offerIsDuo: false,
          },
          screen: 'Search',
        })
      })
    })

    it('when pressing previous button', () => {
      const { getByTestId } = renderOfferDuoModal()

      const previousButton = getByTestId('Fermer')
      fireEvent.press(previousButton)

      expect(mockHideModal).toHaveBeenCalledTimes(1)
    })
  })

  it('should log PerformSearch when pressing search button', async () => {
    const { getByText } = renderOfferDuoModal()

    const button = getByText('Rechercher')

    fireEvent.press(button)

    await waitFor(() => {
      expect(analytics.logPerformSearch).toHaveBeenCalledWith({
        ...mockSearchState,
        view: SearchView.Results,
        offerIsDuo: false,
      })
    })
  })

  describe('with "Appliquer le filtre" button', () => {
    it('should display alternative button title', async () => {
      const { getByText } = renderOfferDuoModal({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })

      await waitFor(() => {
        expect(getByText('Appliquer le filtre')).toBeTruthy()
      })
    })

    it('should update search state when pressing submit button', async () => {
      const { getByText, getByTestId } = renderOfferDuoModal({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })

      const toggle = getByTestId('Interrupteur-limitDuoOfferSearch')

      fireEvent.press(toggle)

      const searchButton = getByText('Appliquer le filtre')

      fireEvent.press(searchButton)

      const expectedSearchParams: SearchState = {
        ...searchState,
        offerIsDuo: true,
        view: SearchView.Results,
      }

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'SET_STATE',
          payload: expectedSearchParams,
        })
      })
    })
  })
})

function renderOfferDuoModal(
  { filterBehaviour = FilterBehaviour.SEARCH, onClose }: Partial<OfferDuoModalProps> = {},
  isDesktopViewport?: boolean
) {
  return render(
    <OfferDuoModal
      title="Type d'offre"
      accessibilityLabel="Ne pas filtrer sur les type d'offre et retourner aux résultats"
      isVisible
      hideModal={mockHideModal}
      filterBehaviour={filterBehaviour}
      onClose={onClose}
    />,
    { theme: { isDesktopViewport } }
  )
}
