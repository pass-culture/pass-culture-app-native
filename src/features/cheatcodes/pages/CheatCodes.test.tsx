import { act, render } from '@testing-library/react-native'
import React from 'react'

import { BatchUser } from '__mocks__/@bam.tech/react-native-batch'
import { flushAllPromises } from 'tests/utils'

import { reactQueryProviderHOC } from '../../../tests/reactQueryProviderHOC'

import { CheatCodes } from './CheatCodes'

const installationID = 'installationID'

beforeAll(() => {
  BatchUser.getInstallationID.mockImplementation(() => Promise.resolve(installationID))
})

jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: false })),
}))

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

  it('should call installationID and display it', async () => {
    const { queryByText } = render(reactQueryProviderHOC(<CheatCodes navigation={navigation} />))

    await act(async () => {
      await flushAllPromises()
    })

    expect(BatchUser.getInstallationID).toHaveBeenCalled()
    expect(queryByText(installationID)).toBeTruthy()
  })
})
