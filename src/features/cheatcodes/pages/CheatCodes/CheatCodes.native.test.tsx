import React from 'react'

import { BatchUser } from '__mocks__/libs/react-native-batch'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { flushAllPromisesWithAct, render } from 'tests/utils'

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

jest.mock('features/auth/AuthContext')

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
    const instance = renderCheatCodes()

    await flushAllPromisesWithAct()
    buttonIsdisplayed
      ? expect(instance.queryByText('Check update')).toBeTruthy()
      : expect(instance.queryByText('Check update')).toBeNull()
    expect.assertions(1)
  })

  it('should call installationID and display it', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { queryByText } = renderCheatCodes()

    await flushAllPromisesWithAct()

    expect(BatchUser.getInstallationID).toHaveBeenCalled()
    expect(queryByText(`Batch installation ID: ${installationID}`)).toBeTruthy()
  })
})

function renderCheatCodes() {
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<CheatCodes navigation={navigation} />))
}
