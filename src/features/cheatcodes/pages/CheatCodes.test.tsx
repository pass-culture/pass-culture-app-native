import { act, render } from '@testing-library/react-native'
import React from 'react'

import { BatchUser } from '__mocks__/@bam.tech/react-native-batch'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { flushAllPromises } from 'tests/utils'

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

describe('CheatCodes component', () => {
  const navigation = {
    dispatch: jest.fn(),
  } as any // eslint-disable-line @typescript-eslint/no-explicit-any

  it('should render correctly', async () => {
    const instance = render(reactQueryProviderHOC(<CheatCodes navigation={navigation} />))

    await act(async () => {
      await flushAllPromises()
    })

    expect(instance.toJSON()).toMatchSnapshot()
  })

  it.each`
    environment     | codePushManual | buttonIsdisplayed
    ${'testing'}    | ${true}        | ${true}
    ${'testing'}    | ${false}       | ${true}
    ${'staging'}    | ${true}        | ${true}
    ${'staging'}    | ${false}       | ${false}
    ${'production'} | ${true}        | ${true}
    ${'production'} | ${false}       | ${false}
  `(
    'should display/not display code push button',
    async ({ environment, codePushManual, buttonIsdisplayed }) => {
      env.ENV = environment
      env.FEATURE_FLAG_CODE_PUSH_MANUAL = codePushManual
      const instance = render(reactQueryProviderHOC(<CheatCodes navigation={navigation} />))

      await act(async () => {
        await flushAllPromises()
      })
      buttonIsdisplayed
        ? expect(instance.queryByText('Check update')).toBeTruthy()
        : expect(instance.queryByText('Check update')).toBeFalsy()
      expect.assertions(1)
    }
  )

  it('should call installationID and display it', async () => {
    const { queryByText } = render(reactQueryProviderHOC(<CheatCodes navigation={navigation} />))

    await act(async () => {
      await flushAllPromises()
    })

    expect(BatchUser.getInstallationID).toHaveBeenCalled()
    expect(queryByText(installationID)).toBeTruthy()
  })
})
