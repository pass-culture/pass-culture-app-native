import React from 'react'
import { FlatList } from 'react-native'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { offerChroniclesFixture } from 'features/chronicle/fixtures/offerChronicles.fixture'
import { Chronicles } from 'features/chronicle/pages/Chronicles/Chronicles'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, userEvent } from 'tests/utils'

const mockOnLayout = {
  nativeEvent: {
    layout: {
      width: 375,
      height: 2100,
    },
  },
}

const mockScrollToIndex = jest.fn()
jest.spyOn(FlatList.prototype, 'scrollToIndex').mockImplementation(mockScrollToIndex)

const mockChronicles = offerChroniclesFixture.chronicles
jest.mock('features/chronicle/api/useChronicles/useChronicles', () => ({
  useChronicles: () => ({ data: mockChronicles, isLoading: false }),
}))

const user = userEvent.setup()

describe('Chronicles', () => {
  beforeEach(() => {
    mockServer.getApi(`/v2/offer/${offerResponseSnap.id}`, offerResponseSnap)
    mockServer.getApi(`/v1/offer/${offerResponseSnap.id}/chronicles`, offerChroniclesFixture)
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
      jest.useFakeTimers()
      render(reactQueryProviderHOC(<Chronicles />))

      await user.press(await screen.findByLabelText('Revenir en arrière'))

      expect(navigate).toHaveBeenNthCalledWith(1, 'Offer', {
        id: offerResponseSnap.id,
        openModalOnNavigation: undefined,
      })

      jest.useRealTimers()
    })

    it('should not scroll to selected chronicle on layout', async () => {
      render(reactQueryProviderHOC(<Chronicles />))

      await screen.findByText('Tous les avis')

      await act(async () => {
        fireEvent(screen.getByTestId('chronicle-list'), 'onLayout', mockOnLayout)
      })

      expect(mockScrollToIndex).not.toHaveBeenCalled()
    })
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

    it('should scroll to selected chronicle on layout', async () => {
      render(reactQueryProviderHOC(<Chronicles />))

      await screen.findByText('Tous les avis')

      await act(async () => {
        fireEvent(screen.getByTestId('chronicle-list'), 'onLayout', mockOnLayout)
      })

      expect(mockScrollToIndex).toHaveBeenCalledTimes(1)
    })
  })
})
