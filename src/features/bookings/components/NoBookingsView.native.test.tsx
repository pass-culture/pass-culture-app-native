import React from 'react'

import { analytics } from 'libs/analytics'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'
import { navigate } from '__mocks__/@react-navigation/native'

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

    expect(screen).toMatchSnapshot()
  })

  it('should render offline no bookings view when netInfo.isConnected is false', () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
    render(reactQueryProviderHOC(<NoBookingsView />))

    expect(screen).toMatchSnapshot()
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
