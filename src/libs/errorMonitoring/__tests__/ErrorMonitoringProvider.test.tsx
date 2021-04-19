import * as Sentry from '@sentry/react-native'
import React from 'react'
import { View, Text } from 'react-native'

import { errorMonitoring } from 'libs/errorMonitoring'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, superFlushWithAct } from 'tests/utils'

import { ErrorMonitoringProvider } from '../ErrorMonitoringProvider'

jest.mock('libs/errorMonitoring/services')

const mockUserId = 1337
jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({
    data: { id: mockUserId, firstName: 'Christophe', lastName: 'Dupont' },
  })),
}))

describe('ErrorMonitoringProvider', () => {
  afterEach(jest.clearAllMocks)

  it(`should render it's children`, async () => {
    const renderAPI = await renderErrorMonitoringProvider()
    expect(renderAPI.getByText('Hello world')).toBeTruthy()
  })

  it('should disable errorMonitoring', async () => {
    await renderErrorMonitoringProvider({
      enabled: false,
    })
    expect(errorMonitoring.init).toBeCalledWith({
      enabled: false,
    })
  })

  it('should enable errorMonitoring', async () => {
    await renderErrorMonitoringProvider({
      enabled: true,
    })
    expect(errorMonitoring.init).toBeCalledWith({
      enabled: true,
    })
  })

  it('should configure sentry scope with extra userId', async () => {
    const mockExtraCall = jest.fn()
    jest.spyOn(Sentry, 'configureScope').mockImplementation(() => {
      mockExtraCall(mockUserId)
    })
    await renderErrorMonitoringProvider({
      enabled: true,
    })
    expect(mockExtraCall).toBeCalledWith(mockUserId)
  })
})

interface Options {
  enabled: boolean
}

const defaultOptions = {
  enabled: true,
}

async function renderErrorMonitoringProvider(options: Options = defaultOptions) {
  const { enabled } = { ...defaultOptions, ...options }
  const renderAPI = render(
    reactQueryProviderHOC(
      <ErrorMonitoringProvider enabled={enabled}>
        <View>
          <Text>Hello world</Text>
        </View>
      </ErrorMonitoringProvider>
    )
  )
  await superFlushWithAct()
  return renderAPI
}
