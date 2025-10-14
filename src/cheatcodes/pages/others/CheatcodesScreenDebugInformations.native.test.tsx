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
jest.mock('@hot-updater/react-native', () => ({
  HotUpdater: {
    checkForUpdate: jest.fn(),
    getBundleId: jest.fn(() => '0199a453-9467-7933-b6d7-6b1020cb5b25'),
    getChannel: jest.fn(() => 'production'),
    getAppVersion: jest.fn(() => '1.0.0'),
    reload: jest.fn(),
    runUpdateProcess: jest.fn(),
  },
}))

describe('<CheatcodesScreenDebugInformations/>', () => {
  it('should display hot updater button for testing environment', async () => {
    env.ENV = 'testing'
    renderCheatCodes()

    await screen.findByText('HOT UPDATER')

    expect(screen.getByText('Check for App Update')).toBeOnTheScreen()
  })

  it('should display hot updater infos for testing environment', async () => {
    env.ENV = 'testing'
    renderCheatCodes()

    await screen.findByText('HOT UPDATER')

    expect(screen.getByText('Bundle ID: 0199a453-9467-7933-b6d7-6b1020cb5b25')).toBeOnTheScreen()
    expect(screen.getByText('Channel: production')).toBeOnTheScreen()
    expect(screen.getByText('App Version: 1.0.0')).toBeOnTheScreen()
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
