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

describe('CheatCodes component', () => {
  it.each`
    environment     | buttonIsdisplayed
    ${'testing'}    | ${true}
    ${'staging'}    | ${false}
    ${'production'} | ${false}
  `('should display/not display code push button', async ({ environment, buttonIsdisplayed }) => {
    env.ENV = environment
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    renderCheatCodes()

    await screen.findByText('CheatCodes')

    buttonIsdisplayed
      ? expect(screen.queryByText('Check update')).toBeOnTheScreen()
      : expect(screen.queryByText('Check update')).not.toBeOnTheScreen()
    expect.assertions(1)
  })

  it('should call installationID and display it', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    renderCheatCodes()

    expect(BatchUser.getInstallationID).toHaveBeenCalledTimes(1)
    expect(await screen.findByText(`Batch installation ID: ${installationID}`)).toBeOnTheScreen()
  })
})

function renderCheatCodes() {
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  render(reactQueryProviderHOC(<CheatCodes navigation={navigation} />))
}
