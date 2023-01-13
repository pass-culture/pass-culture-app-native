import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate } from '__mocks__/@react-navigation/native'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { initialSearchState } from 'features/search/context/reducer'
import { OfferDuoModal } from 'features/search/pages/modals/OfferDuoModal/OfferDuoModal'
import { SearchView } from 'features/search/types'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, waitFor } from 'tests/utils'

const searchId = uuidv4()
const searchState = { ...initialSearchState, searchId }
const mockSearchState = searchState

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
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

const hideOfferDuoModal = jest.fn()

describe('<OfferDuoModal/>', () => {
  describe('modal header', () => {
    it('should have header when viewport width is mobile', () => {
      const isDesktopViewport = false
      const renderAPI = renderOfferDuoModal(
        {
          hideOfferDuoModal,
          offerDuoModalVisible: true,
        },
        isDesktopViewport
      )

      const header = renderAPI.queryByTestId('pageHeader')
      expect(header).toBeTruthy()
    })

    it('should not have header when viewport width is desktop', () => {
      const isDesktopViewport = true
      const renderAPI = renderOfferDuoModal(
        {
          hideOfferDuoModal,
          offerDuoModalVisible: true,
        },
        isDesktopViewport
      )

      const header = renderAPI.queryByTestId('pageHeader')
      expect(header).toBeFalsy()
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
      const renderAPI = renderOfferDuoModal({
        hideOfferDuoModal,
        offerDuoModalVisible: true,
      })

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
      const renderAPI = renderOfferDuoModal({
        hideOfferDuoModal,
        offerDuoModalVisible: true,
      })

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
      const { getByText } = renderOfferDuoModal({
        hideOfferDuoModal,
        offerDuoModalVisible: true,
      })
      const button = getByText('Rechercher')

      fireEvent.press(button)

      await waitFor(() => {
        expect(hideOfferDuoModal).toHaveBeenCalledTimes(1)
      })
    })

    it('should navigate to Search results when selecting DUO offer and submit form', async () => {
      const { getByText, getByTestId } = renderOfferDuoModal({
        hideOfferDuoModal,
        offerDuoModalVisible: true,
      })
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
      const { getByText } = renderOfferDuoModal({
        hideOfferDuoModal,
        offerDuoModalVisible: true,
      })

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
      const { getByTestId } = renderOfferDuoModal({
        hideOfferDuoModal,
        offerDuoModalVisible: true,
      })

      const previousButton = getByTestId('Revenir en arrière')
      fireEvent.press(previousButton)

      expect(hideOfferDuoModal).toHaveBeenCalledTimes(1)
    })
  })

  it('should log PerformSearch when pressing search button', async () => {
    const { getByText } = renderOfferDuoModal({
      hideOfferDuoModal,
      offerDuoModalVisible: true,
    })

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
})

type Props = {
  offerDuoModalVisible: boolean
  hideOfferDuoModal: () => void
}

function renderOfferDuoModal(
  { offerDuoModalVisible, hideOfferDuoModal }: Props,
  isDesktopViewport?: boolean
) {
  return render(
    <OfferDuoModal
      title="Type d'offre"
      accessibilityLabel="Ne pas filtrer sur les type d'offre et retourner aux résultats"
      isVisible={offerDuoModalVisible}
      hideModal={hideOfferDuoModal}
    />,
    { theme: { isDesktopViewport } }
  )
}
