import React from 'react'

import { render, waitFor } from 'tests/utils/web'

import { remoteConfig } from './remoteConfig.services'
import { RemoteConfigProvider } from './RemoteConfigProvider'

const mockedRemoteConfigRefresh = remoteConfig.refresh as jest.MockedFunction<
  typeof remoteConfig.refresh
>

describe('<RemoteConfigProvider />', () => {
  it('should refresh() remote config values then call getValues() to update config', async () => {
    mockedRemoteConfigRefresh.mockResolvedValueOnce(true)
    renderRemoteConfigProvider()

    await waitFor(() => {
      expect(remoteConfig.refresh).toHaveBeenCalledTimes(1)
    })
    expect(remoteConfig.getValues).toHaveBeenCalledTimes(1)
  })
})

function renderRemoteConfigProvider() {
  return render(
    <RemoteConfigProvider>
      <MockChildren />
    </RemoteConfigProvider>
  )
}

const MockChildren = () => null
