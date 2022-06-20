import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { analytics } from 'libs/analytics'
import { useNetInfo as useNetInfoDefault } from 'libs/network/useNetInfo'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render } from 'tests/utils'

import { NoBookingsView } from './NoBookingsView'

const mockDispatchSearch = jest.fn()

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    dispatch: mockDispatchSearch,
  }),
}))

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))

const mockUseNetInfo = useNetInfoDefault as jest.Mock

describe('<NoBookingsView />', () => {
  it('should render online no bookings view', () => {
    mockUseNetInfo.mockReturnValueOnce({ isConnected: true })
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const renderAPI = render(reactQueryProviderHOC(<NoBookingsView />))
    expect(renderAPI).toMatchSnapshot()
  })
  it('should render offline no bookings view', () => {
    mockUseNetInfo.mockReturnValueOnce({ isConnected: false })
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const renderAPI = render(reactQueryProviderHOC(<NoBookingsView />))
    expect(renderAPI).toMatchSnapshot()
  })
  it('should navigate to Search when pressing button and log event', async () => {
    mockUseNetInfo.mockReturnValueOnce({ isConnected: true })
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const renderAPI = render(reactQueryProviderHOC(<NoBookingsView />))
    const button = renderAPI.getByText('Explorer les offres')
    await fireEvent.press(button)
    expect(navigate).toBeCalledWith(...getTabNavConfig('Search', { showResults: true }))
    expect(analytics.logDiscoverOffers).toHaveBeenCalledWith('bookings')
  })
})
