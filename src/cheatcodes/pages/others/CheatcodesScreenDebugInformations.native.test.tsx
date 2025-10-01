import React from 'react'

import { BatchProfile, BatchUser } from '__mocks__/@batch.com/react-native-plugin'
import { env } from 'libs/environment/env'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

import { CheatcodesScreenDebugInformations } from './CheatcodesScreenDebugInformations'

const installationID = 'installationID'

beforeAll(() => {
  BatchUser.getInstallationID.mockImplementation(() => Promise.resolve(installationID))
  BatchProfile.identify.mockImplementation(() => ({
    setIdentifier: () => ({ save: jest.fn() }),
  }))
})

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/firebase/analytics/analytics')

describe.skip('<CheatcodesScreenDebugInformations/>', () => {
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
  render(reactQueryProviderHOC(<CheatcodesScreenDebugInformations />))
}
