import * as reactNavigationNative from '@react-navigation/native'
import React from 'react'
import { FlatList } from 'react-native'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SubcategoriesResponseModelv2, SubcategoryIdEnum } from 'api/gen'
import { offerClubAdvicesFixture } from 'features/clubAdvices/fixtures/clubAdvices.fixture'
import { ClubAdvices } from 'features/clubAdvices/pages/ClubAdvices/ClubAdvices'
import * as useGoBack from 'features/navigation/useGoBack'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { analytics } from 'libs/analytics/provider'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, userEvent, waitFor } from 'tests/utils'
import * as useModal from 'ui/components/modals/useModal'

const mockOnLayout = {
  nativeEvent: {
    layout: {
      width: 375,
      height: 2100,
    },
  },
}

jest.mock('libs/firebase/analytics/analytics')

const mockScrollToIndex = jest.fn()
jest.spyOn(FlatList.prototype, 'scrollToIndex').mockImplementation(mockScrollToIndex)

const mockAdvices = offerClubAdvicesFixture.chronicles
jest.mock('features/clubAdvices/queries/useClubAdvicesQuery', () => ({
  useClubAdvicesQuery: () => ({ data: mockAdvices, isLoading: false }),
}))

const mockNavigate = jest.fn()
jest.spyOn(reactNavigationNative, 'useNavigation').mockReturnValue({
  navigate: mockNavigate,
})

const mockData: SubcategoriesResponseModelv2 | undefined = PLACEHOLDER_DATA
jest.mock('queries/subcategories/useSubcategoriesQuery', () => ({
  useSubcategoriesQuery: () => ({
    data: mockData,
  }),
}))

const mockShowModal = jest.fn()
const mockCloseModal = jest.fn()

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('ClubAdvices', () => {
  beforeEach(() => {
    mockServer.getApi(`/v3/offer/${offerResponseSnap.id}`, offerResponseSnap)
    mockServer.getApi(`/v1/offer/${offerResponseSnap.id}/chronicles`, offerClubAdvicesFixture)
  })

  describe('When advice id defined', () => {
    beforeAll(() => {
      useRoute.mockReturnValue({
        params: {
          offerId: offerResponseSnap.id,
          adviceId: 1,
        },
      })
    })

    it('should display book club icon when offer subcategory linked to a book', async () => {
      mockServer.getApi(`/v3/offer/${offerResponseSnap.id}`, {
        ...offerResponseSnap,
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      })

      render(reactQueryProviderHOC(<ClubAdvices />))

      await screen.findByText('Tous les avis du book club')

      expect(screen.getAllByTestId('bookClubIcon')[0]).toBeOnTheScreen()
    })

    it('should display cine club icon when offer subcategory linked to a film', async () => {
      mockServer.getApi(`/v3/offer/${offerResponseSnap.id}`, {
        ...offerResponseSnap,
        subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
      })

      render(reactQueryProviderHOC(<ClubAdvices />))

      await screen.findByText('Tous les avis du ciné club')

      expect(screen.getAllByTestId('cineClubIcon')[0]).toBeOnTheScreen()
    })

    it('should scroll to selected advice on layout', async () => {
      render(reactQueryProviderHOC(<ClubAdvices />))

      await screen.findByText('Tous les avis du ciné club')

      await act(async () => {
        fireEvent(screen.getByTestId('advice-list'), 'onLayout', mockOnLayout)
      })

      await waitFor(() => expect(mockScrollToIndex).toHaveBeenCalledTimes(1))
    })

    it('should open advices writers modal when pressing "Qui écrit les avis du ciné club ?" button', async () => {
      jest.spyOn(useModal, 'useModal').mockReturnValueOnce({
        visible: false,
        showModal: mockShowModal,
        hideModal: jest.fn(),
        toggleModal: jest.fn(),
      })
      render(reactQueryProviderHOC(<ClubAdvices />))

      await user.press(await screen.findByText('Qui écrit les avis du ciné club ?'))

      expect(mockShowModal).toHaveBeenCalledTimes(1)
    })

    it('should trigger ClickWhatsClub log when pressing "Qui écrit les avis du ciné club ?" button', async () => {
      jest.spyOn(useModal, 'useModal').mockReturnValueOnce({
        visible: false,
        showModal: jest.fn(),
        hideModal: jest.fn(),
        toggleModal: jest.fn(),
      })
      render(reactQueryProviderHOC(<ClubAdvices />))

      await user.press(await screen.findByText('Qui écrit les avis du ciné club ?'))

      expect(analytics.logClickWhatsClub).toHaveBeenNthCalledWith(1, {
        categoryName: 'CINEMA',
        from: 'chronicles',
        offerId: '116656',
      })
    })
  })

  describe('When advice id not defined', () => {
    beforeAll(() => {
      useRoute.mockReturnValue({
        params: {
          offerId: offerResponseSnap.id,
          openModalOnNavigation: true,
        },
      })
    })

    it('should render correctly', async () => {
      render(reactQueryProviderHOC(<ClubAdvices />))

      expect(await screen.findByText('Tous les avis du ciné club')).toBeOnTheScreen()
    })

    it('should execute goBack when pressing back button', async () => {
      render(reactQueryProviderHOC(<ClubAdvices />))

      await user.press(await screen.findByLabelText('Revenir en arrière'))

      expect(mockGoBack).toHaveBeenCalledTimes(1)
    })

    it('should not scroll to selected advice on layout', async () => {
      render(reactQueryProviderHOC(<ClubAdvices />))

      await screen.findByText('Tous les avis du ciné club')

      await act(async () => {
        fireEvent(screen.getByTestId('advice-list'), 'onLayout', mockOnLayout)
      })

      expect(mockScrollToIndex).not.toHaveBeenCalled()
    })

    describe('When modal is open', () => {
      beforeEach(() => {
        jest.spyOn(useModal, 'useModal').mockReturnValueOnce({
          visible: true,
          showModal: jest.fn(),
          hideModal: mockCloseModal,
          toggleModal: jest.fn(),
        })
      })

      it('should close the modal when pressing close button', async () => {
        render(reactQueryProviderHOC(<ClubAdvices />))

        await user.press(await screen.findByLabelText('Fermer la modale'))

        expect(mockCloseModal).toHaveBeenCalledTimes(1)
      })

      it('should navigate to recommandation thematic home when pressing button', async () => {
        render(reactQueryProviderHOC(<ClubAdvices />))

        await user.press(await screen.findByText('Voir tous les avis des clubs'))

        await waitFor(async () => {
          expect(mockNavigate).toHaveBeenNthCalledWith(1, 'ThematicHome', {
            homeId: '4mlVpAZySUZO6eHazWKZeV',
            from: 'chronicles',
          })
        })
      })

      it('should trigger ClickAllClubRecos log when pressing button', async () => {
        render(reactQueryProviderHOC(<ClubAdvices />))

        await user.press(await screen.findByText('Voir tous les avis des clubs'))

        await waitFor(() => {
          expect(analytics.logClickAllClubRecos).toHaveBeenNthCalledWith(1, {
            categoryName: 'CINEMA',
            from: 'chronicles',
            offerId: '116656',
          })
        })
      })
    })
  })
})
