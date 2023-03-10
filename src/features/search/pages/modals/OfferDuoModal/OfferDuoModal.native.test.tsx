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
import { fireEvent, render, screen, superFlushWithAct, waitFor } from 'tests/utils'

const searchId = uuidv4()
const searchState = { ...initialSearchState, searchId }
const mockSearchState = searchState
const mockDispatch = jest.fn()

/* TODO(LucasBeneston): Remove this mock when update to Jest 28
  In jest version 28, I don't bring that error :
  TypeError: requestAnimationFrame is not a function */
jest.mock('react-native/Libraries/Animated/animations/TimingAnimation')

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
    jest.useFakeTimers('legacy')
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
        renderOfferDuoModal({
          filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
        })

        await waitFor(() => {
          expect(screen.getByTestId('Revenir en arrière')).toBeTruthy()
        })
      })

      it('should close the modal and general filter page when pressing close button when the modal is opening from general filter page', async () => {
        renderOfferDuoModal({
          filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
          onClose: mockOnClose,
        })

        const closeButton = screen.getByTestId('Fermer')
        fireEvent.press(closeButton)

        expect(mockOnClose).toHaveBeenCalledTimes(1)
      })

      it('should only close the modal when pressing close button when the modal is opening from search results', async () => {
        renderOfferDuoModal()

        const closeButton = screen.getByTestId('Fermer')
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
      renderOfferDuoModal()
      const button = screen.getByText('Rechercher')

      fireEvent.press(button)

      await waitFor(() => {
        expect(mockHideModal).toHaveBeenCalledTimes(1)
      })
    })

    it('when pressing previous button', () => {
      renderOfferDuoModal()

      const previousButton = screen.getByTestId('Fermer')
      fireEvent.press(previousButton)

      expect(mockHideModal).toHaveBeenCalledTimes(1)
    })
  })

  describe('with "Appliquer le filtre" button', () => {
    it('should display alternative button title', async () => {
      renderOfferDuoModal({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })

      await waitFor(() => {
        expect(screen.getByText('Appliquer le filtre')).toBeTruthy()
      })
    })

    it('should update search state when pressing submit button', async () => {
      renderOfferDuoModal({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })

      const toggle = screen.getByTestId('Interrupteur-limitDuoOfferSearch')

      fireEvent.press(toggle)

      const searchButton = screen.getByText('Appliquer le filtre')

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

    it('should not log PerformSearch when pressing button', async () => {
      renderOfferDuoModal({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })

      const button = screen.getByText('Appliquer le filtre')

      fireEvent.press(button)

      await waitFor(() => {
        expect(analytics.logPerformSearch).toHaveBeenCalledTimes(0)
      })
    })
  })

  describe('with "Rechercher" button', () => {
    it('should navigate to Search results when selecting DUO offer and pressing button', async () => {
      renderOfferDuoModal()
      const toggle = screen.getByTestId('Interrupteur-limitDuoOfferSearch')
      const button = screen.getByText('Rechercher')

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

    it('should use default filters without change when pressing button', async () => {
      renderOfferDuoModal()

      const button = screen.getByText('Rechercher')

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

    it('should log PerformSearch when pressing button', async () => {
      renderOfferDuoModal()

      const button = screen.getByText('Rechercher')

      fireEvent.press(button)

      await waitFor(() => {
        expect(analytics.logPerformSearch).toHaveBeenCalledWith({
          ...mockSearchState,
          view: SearchView.Results,
          offerIsDuo: false,
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
      title="Type d’offre"
      accessibilityLabel="Ne pas filtrer sur les type d’offre et retourner aux résultats"
      isVisible
      hideModal={mockHideModal}
      filterBehaviour={filterBehaviour}
      onClose={onClose}
    />,
    { theme: { isDesktopViewport } }
  )
}
