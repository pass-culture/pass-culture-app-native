import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { initialSearchState } from 'features/search/context/reducer'
import { ISearchContext } from 'features/search/context/SearchWrapper'
import { FilterBehaviour } from 'features/search/enums'
import {
  OfferDuoModal,
  OfferDuoModalProps,
} from 'features/search/pages/modals/OfferDuoModal/OfferDuoModal'
import { SearchState } from 'features/search/types'
import { beneficiaryUser } from 'fixtures/user'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { render, screen, userEvent, waitFor } from 'tests/utils'

const searchId = uuidv4()
const searchState = { ...initialSearchState, searchId }
const mockDispatch = jest.fn()
const initialMockUseSearch = {
  searchState,
  dispatch: mockDispatch,
}
const mockUseSearch: jest.Mock<Partial<ISearchContext>> = jest.fn(() => initialMockUseSearch)
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => mockUseSearch(),
}))

jest.mock('features/auth/context/AuthContext')
const mockUser = { ...beneficiaryUser, domainsCredit: { all: { initial: 8000, remaining: 7000 } } }
mockAuthContextWithUser(mockUser)

const mockHideModal = jest.fn()
const mockOnClose = jest.fn()

jest.mock('react-native/Libraries/Animated/animations/TimingAnimation')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<OfferDuoModal/>', () => {
  it('should render modal correctly after animation and with enabled submit', async () => {
    renderOfferDuoModal()
    await screen.findByText('Uniquement les offres duo')

    expect(screen).toMatchSnapshot()
  })

  describe('modal header', () => {
    it('should have header when viewport width is mobile', () => {
      const isDesktopViewport = false
      renderOfferDuoModal({}, isDesktopViewport)

      const header = screen.queryByTestId('pageHeader')

      expect(header).toBeOnTheScreen()
    })

    describe('Buttons', () => {
      it('should close the modal and general filter page when pressing close button when the modal is opening from general filter page', async () => {
        renderOfferDuoModal({
          filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
          onClose: mockOnClose,
        })

        const closeButton = screen.getByTestId('Fermer')
        await user.press(closeButton)

        expect(mockOnClose).toHaveBeenCalledTimes(1)
      })

      it('should only close the modal when pressing close button when the modal is opening from search results', async () => {
        renderOfferDuoModal()

        const closeButton = screen.getByTestId('Fermer')
        await user.press(closeButton)

        expect(mockOnClose).not.toHaveBeenCalled()
      })
    })
  })

  describe('when user is logged in and beneficiary with credit', () => {
    beforeEach(() => {
      mockAuthContextWithUser(beneficiaryUser)
    })

    it('should toggle offerIsDuo', async () => {
      renderOfferDuoModal()

      const toggle = screen.getByTestId('Interrupteur limitDuoOfferSearch')

      expect(toggle.props.accessibilityState).toEqual({
        disabled: false,
        checked: false,
      })

      await user.press(toggle)

      expect(toggle.props.accessibilityState).toEqual({
        disabled: false,
        checked: true,
      })
    })
  })

  describe('click reset button', () => {
    it('should disable duo offer when click on reset button', async () => {
      renderOfferDuoModal()

      const toggle = screen.getByTestId('Interrupteur limitDuoOfferSearch')

      await user.press(toggle)

      const resetButton = screen.getByText('Réinitialiser')

      await user.press(resetButton)

      expect(toggle.props.accessibilityState).toEqual({
        disabled: false,
        checked: false,
      })
    })

    it('should reset search when pressing reset button', async () => {
      mockUseSearch.mockReturnValueOnce({
        ...initialMockUseSearch,
        searchState: {
          ...searchState,
          offerIsDuo: true,
        },
      })
      renderOfferDuoModal()

      const resetButton = screen.getByText('Réinitialiser')

      await user.press(resetButton)

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: {
          ...searchState,
          offerIsDuo: false,
        },
      })
    })
  })

  describe('should close the modal', () => {
    it('should close modal on submit', async () => {
      renderOfferDuoModal()
      const button = screen.getByText('Rechercher')

      await user.press(button)

      expect(mockHideModal).toHaveBeenCalledTimes(1)
    })

    it('when pressing previous button', async () => {
      renderOfferDuoModal()

      const previousButton = screen.getByTestId('Fermer')
      await user.press(previousButton)

      expect(mockHideModal).toHaveBeenCalledTimes(1)
    })
  })

  describe('with "Appliquer le filtre" button', () => {
    it('should display alternative button title', async () => {
      renderOfferDuoModal({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })

      await waitFor(() => {
        expect(screen.getByText('Appliquer le filtre')).toBeOnTheScreen()
      })
    })

    it('should update search state when pressing submit button', async () => {
      renderOfferDuoModal({
        filterBehaviour: FilterBehaviour.APPLY_WITHOUT_SEARCHING,
      })

      const toggle = screen.getByTestId('Interrupteur limitDuoOfferSearch')

      await user.press(toggle)

      const searchButton = screen.getByText('Appliquer le filtre')

      await user.press(searchButton)

      const expectedSearchParams: SearchState = {
        ...searchState,
        offerIsDuo: true,
      }

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: expectedSearchParams,
      })
    })
  })

  describe('with "Rechercher" button', () => {
    it('should set search state view to Search results when selecting DUO offer and pressing button', async () => {
      renderOfferDuoModal()
      const toggle = screen.getByTestId('Interrupteur limitDuoOfferSearch')

      await user.press(toggle)

      await user.press(screen.getByText('Rechercher'))

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: {
          ...searchState,
          offerIsDuo: true,
        },
      })
    })

    it('should use default filters without change when pressing button', async () => {
      renderOfferDuoModal()

      await user.press(screen.getByText('Rechercher'))

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: {
          ...searchState,
          offerIsDuo: false,
        },
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
