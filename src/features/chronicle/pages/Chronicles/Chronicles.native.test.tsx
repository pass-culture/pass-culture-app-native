import * as reactNavigationNative from '@react-navigation/native'
import React from 'react'
import { FlatList } from 'react-native'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SubcategoryIdEnum } from 'api/gen'
import { offerChroniclesFixture } from 'features/chronicle/fixtures/offerChronicles.fixture'
import { Chronicles } from 'features/chronicle/pages/Chronicles/Chronicles'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
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

const mockChronicles = offerChroniclesFixture.chronicles
jest.mock('features/chronicle/api/useChronicles/useChronicles', () => ({
  useChronicles: () => ({ data: mockChronicles, isLoading: false }),
}))

const mockNavigate = jest.fn()
jest.spyOn(reactNavigationNative, 'useNavigation').mockReturnValue({
  navigate: mockNavigate,
})

const mockShowModal = jest.fn()
const mockCloseModal = jest.fn()

const user = userEvent.setup()
jest.useFakeTimers()

describe('Chronicles', () => {
  beforeEach(() => {
    mockServer.getApi(`/v2/offer/${offerResponseSnap.id}`, offerResponseSnap)
    mockServer.getApi(`/v1/offer/${offerResponseSnap.id}/chronicles`, offerChroniclesFixture)
  })

  describe('When chronicle id defined', () => {
    beforeAll(() => {
      useRoute.mockReturnValue({
        params: {
          offerId: offerResponseSnap.id,
          chronicleId: 1,
        },
      })
    })

    it('should display book club icon when offer subcategory linked to a book', async () => {
      mockServer.getApi(`/v2/offer/${offerResponseSnap.id}`, {
        ...offerResponseSnap,
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      })

      render(reactQueryProviderHOC(<Chronicles />))

      await screen.findByText('Tous les avis')

      expect(screen.getAllByTestId('bookClubIcon')[0]).toBeOnTheScreen()
    })

    it('should display cine club icon when offer subcategory linked to a film', async () => {
      mockServer.getApi(`/v2/offer/${offerResponseSnap.id}`, {
        ...offerResponseSnap,
        subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
      })

      render(reactQueryProviderHOC(<Chronicles />))

      await screen.findByText('Tous les avis')

      expect(screen.getAllByTestId('cineClubIcon')[0]).toBeOnTheScreen()
    })

    it('should scroll to selected chronicle on layout', async () => {
      render(reactQueryProviderHOC(<Chronicles />))

      await screen.findByText('Tous les avis')

      await act(async () => {
        fireEvent(screen.getByTestId('chronicle-list'), 'onLayout', mockOnLayout)
      })

      await waitFor(() => expect(mockScrollToIndex).toHaveBeenCalledTimes(1))
    })

    it('should open chronicle modal when pressing "C’est quoi le Ciné Club ?" button', async () => {
      jest.spyOn(useModal, 'useModal').mockReturnValueOnce({
        visible: false,
        showModal: mockShowModal,
        hideModal: jest.fn(),
        toggleModal: jest.fn(),
      })
      render(reactQueryProviderHOC(<Chronicles />))

      await user.press(await screen.findByText('C’est quoi le Ciné Club ?'))

      expect(mockShowModal).toHaveBeenCalledTimes(1)
    })
  })

  describe('When chronicle id not defined', () => {
    beforeAll(() => {
      useRoute.mockReturnValue({
        params: {
          offerId: offerResponseSnap.id,
          openModalOnNavigation: true,
        },
      })
    })

    it('should render correctly', async () => {
      render(reactQueryProviderHOC(<Chronicles />))

      expect(await screen.findByText('Tous les avis')).toBeOnTheScreen()
    })

    it('should navigate to offer page without openModalOnNavigation param when pressing back button', async () => {
      render(reactQueryProviderHOC(<Chronicles />))

      await user.press(await screen.findByLabelText('Revenir en arrière'))

      expect(mockNavigate).toHaveBeenNthCalledWith(1, 'Offer', {
        id: offerResponseSnap.id,
        openModalOnNavigation: undefined,
      })
    })

    it('should not scroll to selected chronicle on layout', async () => {
      render(reactQueryProviderHOC(<Chronicles />))

      await screen.findByText('Tous les avis')

      await act(async () => {
        fireEvent(screen.getByTestId('chronicle-list'), 'onLayout', mockOnLayout)
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
        render(reactQueryProviderHOC(<Chronicles />))

        await user.press(await screen.findByLabelText('Fermer la modale'))

        expect(mockCloseModal).toHaveBeenCalledTimes(1)
      })

      it('should navigate to recommandation thematic home when pressing button', async () => {
        render(reactQueryProviderHOC(<Chronicles />))

        await user.press(await screen.findByText('Voir toutes les recos du Ciné Club'))

        await waitFor(async () => {
          expect(mockNavigate).toHaveBeenNthCalledWith(1, 'ThematicHome', {
            homeId: '4mlVpAZySUZO6eHazWKZeV',
            from: 'chronicles',
          })
        })
      })
    })
  })
})
