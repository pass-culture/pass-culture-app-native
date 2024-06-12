import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/analytics'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'
import { DOUBLE_LINE_BREAK } from 'ui/theme/constants'

import { NoBookingsView } from './NoBookingsView'

const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    resetSearch: jest.fn(),
  }),
}))

describe('<NoBookingsView />', () => {
  it('should render online no bookings view when netInfo.isConnected is true', () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: true })
    render(reactQueryProviderHOC(<NoBookingsView />))

    const explanations = screen.getByText(
      'Tu n’as pas de réservation en cours. Explore le catalogue pour trouver ton bonheur !'
    )

    expect(explanations).toBeOnTheScreen()
  })

  it('should render offline no bookings view when netInfo.isConnected is false', () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
    render(reactQueryProviderHOC(<NoBookingsView />))

    const explanations = screen.getByText(
      'Aucune réservations en cours.' +
        DOUBLE_LINE_BREAK +
        'Il est possible que certaines réservations ne s’affichent pas hors connexion. Connecte-toi à internet pour vérifier.'
    )

    expect(explanations).toBeOnTheScreen()
  })

  it('should navigate to Search when pressing button and log event', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: true })
    render(reactQueryProviderHOC(<NoBookingsView />))

    const button = screen.getByText('Découvrir le catalogue')
    fireEvent.press(button)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('TabNavigator', {
        params: { params: undefined, screen: 'SearchLanding' },
        screen: 'SearchStackNavigator',
      })

      expect(analytics.logDiscoverOffers).toHaveBeenCalledWith('bookings')
    })
  })
})
