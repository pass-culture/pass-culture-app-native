import * as reactNavigationNative from '@react-navigation/native'
import React from 'react'
import { FlatList } from 'react-native'

import { useRoute } from '__mocks__/@react-navigation/native'
import { VenueProAdvices, VenueResponse } from 'api/gen'
import * as useGoBack from 'features/navigation/useGoBack'
import { ProAdvicesVenue } from 'features/proAdvices/pages/ProAdvicesVenue'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { venueProAdvicesFixture } from 'features/venue/fixtures/venueProAdvices.fixture'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, userEvent, waitFor } from 'tests/utils'

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

const mockNavigate = jest.fn()
jest.spyOn(reactNavigationNative, 'useNavigation').mockReturnValue({
  navigate: mockNavigate,
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('ProAdvicesVenue', () => {
  beforeAll(() => {
    useRoute.mockReturnValue({ params: { venueId: venueDataTest.id } })
  })

  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_PRO_REVIEWS_VENUE])
    mockServer.getApi<Omit<VenueResponse, 'isVirtual'>>(
      `/v2/venue/${venueDataTest.id}`,
      venueDataTest
    )
    mockServer.getApi<VenueProAdvices>(`/v1/venue/${venueDataTest.id}/advices`, {
      proAdvices: [...venueProAdvicesFixture.proAdvices],
      nbResults: venueProAdvicesFixture.nbResults,
    })
  })

  it('should display correctly', async () => {
    render(reactQueryProviderHOC(<ProAdvicesVenue />))

    expect(await screen.findByText('Les 2 avis par “Le Petit Rintintin 1”')).toBeTruthy()
  })

  it('should execute goBack when pressing back button', async () => {
    render(reactQueryProviderHOC(<ProAdvicesVenue />))

    await user.press(await screen.findByLabelText('Revenir en arrière'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should open advices writers modal when pressing "Qui écrit les avis des pros ?" button', async () => {
    render(reactQueryProviderHOC(<ProAdvicesVenue />))

    await user.press(await screen.findByText('Qui écrit les avis des pros ?'))

    expect(
      screen.getByText(/Les avis des pros sont rédigés par nos partenaires culturels du pass/i)
    ).toBeOnTheScreen()
  })

  it('should navigate to recommandation thematic home when pressing "Voir tous les avis des pros" button in advices writers modal', async () => {
    render(reactQueryProviderHOC(<ProAdvicesVenue />))

    await user.press(await screen.findByText('Qui écrit les avis des pros ?'))

    await user.press(await screen.findByText('Voir tous les avis des pros'))

    expect(mockNavigate).toHaveBeenCalledWith('ThematicHome', {
      homeId: '4mlVpAZySUZO6eHazWKZeV',
      from: 'venue',
    })
  })

  describe('When offer id defined', () => {
    beforeAll(() => {
      useRoute.mockReturnValue({ params: { venueId: venueDataTest.id, offerId: 1 } })
    })

    it('should scroll to selected advice on layout', async () => {
      render(reactQueryProviderHOC(<ProAdvicesVenue />))

      await screen.findByText('Les 2 avis par “Le Petit Rintintin 1”')

      await act(async () => {
        fireEvent(screen.getByTestId('advice-list'), 'onLayout', mockOnLayout)
      })

      await waitFor(() => expect(mockScrollToIndex).toHaveBeenCalledTimes(1))
    })
  })
})
