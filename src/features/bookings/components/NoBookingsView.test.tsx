import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SearchView } from 'features/search/types'
import { analytics } from 'libs/firebase/analytics'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
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
const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

describe('<NoBookingsView />', () => {
  it('should render online no bookings view when netInfo.isConnected is true', () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: true })
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const renderAPI = render(reactQueryProviderHOC(<NoBookingsView />))
    expect(renderAPI).toMatchSnapshot()
  })
  it('should render offline no bookings view when netInfo.isConnected is false', () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const renderAPI = render(reactQueryProviderHOC(<NoBookingsView />))
    expect(renderAPI).toMatchSnapshot()
  })
  it('should navigate to Search when pressing button and log event', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: true })
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const renderAPI = render(reactQueryProviderHOC(<NoBookingsView />))
    const button = renderAPI.getByText('Découvrir le catalogue')
    await fireEvent.press(button)
    expect(navigate).toBeCalledWith(...getTabNavConfig('Search', { view: SearchView.Landing }))
    expect(analytics.logDiscoverOffers).toHaveBeenCalledWith('bookings')
  })
})
