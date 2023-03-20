import React from 'react'

import { render, waitFor } from 'tests/utils'

import { remoteConfig } from './remoteConfig.services'
import { RemoteConfigProvider } from './RemoteConfigProvider'

const mockedRemoteConfigRefresh = remoteConfig.refresh as jest.MockedFunction<
  typeof remoteConfig.refresh
>

const MockChildren = () => null

describe('<RemoteConfigProvider />', () => {
  it('should configure() then refresh() remote config values then call getValues() to update config', async () => {
    mockedRemoteConfigRefresh.mockResolvedValueOnce(true)
    render(
      <RemoteConfigProvider>
        <MockChildren />
      </RemoteConfigProvider>
    )

    await waitFor(() => {
      expect(remoteConfig.configure).toHaveBeenCalledTimes(1)
    })
    expect(remoteConfig.refresh).toHaveBeenCalledTimes(1)
    expect(remoteConfig.getValues).toHaveBeenCalledTimes(1)
  })
})
