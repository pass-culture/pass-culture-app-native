import React from 'react'

import { ProfileV2 } from 'features/profile/pages/Profile/ProfileV2/ProfileV2'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock
mockUseNetInfoContext.mockReturnValue({ isConnected: true, isInternetReachable: true })

describe('<ProfileV2/>', () => {
  it('should display ProfileOnline when user is connected to internet', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: true, isInternetReachable: true })
    render(reactQueryProviderHOC(<ProfileV2 />))

    expect(await screen.findByTestId('profile-V2')).toBeOnTheScreen()
  })

  it('should display ProfileOffline when user is not connected to internet', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false, isInternetReachable: true })
    render(reactQueryProviderHOC(<ProfileV2 />))

    expect(await screen.findByText('Pas de réseau internet')).toBeOnTheScreen()
  })
})
