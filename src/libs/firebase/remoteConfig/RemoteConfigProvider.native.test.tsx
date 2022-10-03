import React from 'react'
import waitForExpect from 'wait-for-expect'

import { render } from 'tests/utils'

import { remoteConfig } from './remoteConfig.services'
import { RemoteConfigProvider } from './RemoteConfigProvider'

const mockedRemoteConfigRefresh = remoteConfig.refresh as jest.MockedFunction<
  typeof remoteConfig.refresh
>

describe('<RemoteConfigProvider />', () => {
  it('should configure() then refresh() remote config values then call getValues() to update config', async () => {
    mockedRemoteConfigRefresh.mockResolvedValueOnce(true)
    renderRemoteConfigProvider()

    await waitForExpect(() => {
      expect(remoteConfig.configure).toBeCalled()
      expect(remoteConfig.refresh).toBeCalled()
    })
    expect(remoteConfig.getValues).toBeCalled()
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
