import React from 'react'

import { BatchUser } from '__mocks__/libs/react-native-batch'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

import { CheatCodes } from './CheatCodes'

const installationID = 'installationID'

beforeAll(() => {
  BatchUser.getInstallationID.mockImplementation(() => Promise.resolve(installationID))
  BatchUser.editor.mockImplementation(() => ({
    setIdentifier: () => ({
      save: jest.fn(),
    }),
  }))
})

jest.mock('features/auth/context/AuthContext')

const navigation = {
  dispatch: jest.fn(),
} as any // eslint-disable-line @typescript-eslint/no-explicit-any

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('CheatCodes component', () => {
  it('should display code push button for testing environment', async () => {
    env.ENV = 'testing'
    renderCheatCodes()

    await screen.findByText('CheatCodes')

    expect(screen.getByText('Check update')).toBeOnTheScreen()
  })

  it.each`
    environment
    ${'staging'}
    ${'production'}
  `('should not display code push button for $environment environment', async ({ environment }) => {
    env.ENV = environment
    renderCheatCodes()

    await screen.findByText('CheatCodes')

    expect(screen.queryByText('Check update')).not.toBeOnTheScreen()
  })

  it('should call installationID and display it', async () => {
    renderCheatCodes()

    expect(BatchUser.getInstallationID).toHaveBeenCalledTimes(1)
    expect(await screen.findByText(`Batch installation ID: ${installationID}`)).toBeOnTheScreen()
  })
})

function renderCheatCodes() {
  render(reactQueryProviderHOC(<CheatCodes navigation={navigation} />))
}
