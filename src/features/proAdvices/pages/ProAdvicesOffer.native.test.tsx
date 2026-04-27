import React from 'react'
import { FlatList } from 'react-native'

import { useRoute } from '__mocks__/@react-navigation/native'
import { OfferProAdvices } from 'api/gen'
import { offerProAdvicesFixture } from 'features/advices/fixtures/offerProAdvices.fixture'
import * as useGoBack from 'features/navigation/useGoBack'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { ProAdvicesOffer } from 'features/proAdvices/pages/ProAdvicesOffer'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, userEvent, waitFor } from 'tests/utils'
import * as useModalAPI from 'ui/components/modals/useModal'

jest.mock('libs/firebase/analytics/analytics')

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

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('ProAdvicesOffer', () => {
  beforeEach(() => {
    useRoute.mockReturnValue({ params: { offerId: offerResponseSnap.id } })
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_PRO_REVIEWS_OFFER])
    mockServer.getApi(`/v3/offer/${offerResponseSnap.id}`, offerResponseSnap)
    mockServer.getApi<OfferProAdvices>(`/v1/offer/${offerResponseSnap.id}/advices`, {
      proAdvices: [...offerProAdvicesFixture.proAdvices],
      nbResults: offerProAdvicesFixture.nbResults,
    })
  })

  it('should display correctly', async () => {
    render(reactQueryProviderHOC(<ProAdvicesOffer />))

    expect(await screen.findByText('2 avis des pros')).toBeTruthy()
  })

  it('should execute goBack when pressing back button', async () => {
    render(reactQueryProviderHOC(<ProAdvicesOffer />))

    await user.press(await screen.findByLabelText('Revenir en arrière'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should open advices writers modal when pressing "Qui écrit les avis des pros ?" button', async () => {
    render(reactQueryProviderHOC(<ProAdvicesOffer />))

    await user.press(await screen.findByText('Qui écrit les avis des pros ?'))

    expect(
      screen.getByText(/Les avis des pros sont rédigés par nos partenaires culturels du pass/i)
    ).toBeOnTheScreen()
  })

  it('should close the modal when pressing "Voir tous les avis des pros" button in advices writers modal', async () => {
    const mockHideModal = jest.fn()
    jest.spyOn(useModalAPI, 'useModal').mockReturnValueOnce({
      visible: true,
      showModal: jest.fn(),
      hideModal: mockHideModal,
      toggleModal: jest.fn(),
    })
    render(reactQueryProviderHOC(<ProAdvicesOffer />))

    await user.press(await screen.findByText('Voir tous les avis des pros'))

    expect(mockHideModal).toHaveBeenCalledTimes(1)
  })

  it('should trigger ConsultVenue log when pressing pro advice card header', async () => {
    render(reactQueryProviderHOC(<ProAdvicesOffer />))

    await screen.findByText('2 avis des pros')

    const cardHeader = screen.getByLabelText('Voir le lieu The Best Place')

    if (cardHeader) {
      await user.press(cardHeader)
    }

    expect(analytics.logConsultVenue).toHaveBeenCalledWith({
      adviceType: 'pro',
      from: 'offer',
      offerId: '116656',
      originDetail: 'Les avis des pros',
      venueId: '1',
    })
  })

  describe('When venue id defined', () => {
    beforeEach(() => {
      useRoute.mockReturnValue({ params: { offerId: offerResponseSnap.id, venueId: 1 } })
    })

    it('should scroll to selected advice on layout', async () => {
      render(reactQueryProviderHOC(<ProAdvicesOffer />))

      await screen.findByText('2 avis des pros')

      await act(async () => {
        fireEvent(screen.getByTestId('advice-list'), 'onLayout', mockOnLayout)
      })

      await waitFor(() => expect(mockScrollToIndex).toHaveBeenCalledTimes(1))
    })
  })
})
