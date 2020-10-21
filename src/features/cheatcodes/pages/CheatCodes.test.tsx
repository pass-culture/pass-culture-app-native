import { render, waitFor } from '@testing-library/react-native'
import React from 'react'

import { BatchUser } from '../../../../__mocks__/@bam.tech/react-native-batch'

import { CheatCodes } from './CheatCodes'

const installationID = 'installationID'
describe('CheatCodes component', () => {
  beforeAll(() => {
    BatchUser.getInstallationID.mockImplementation(() => Promise.resolve(installationID))
  })
  const navigation = {
    dispatch: jest.fn(),
  } as any // eslint-disable-line @typescript-eslint/no-explicit-any

  it('should render correctly', async () => {
    const cheatCodes = render(<CheatCodes navigation={navigation} />)
    expect(cheatCodes).toMatchSnapshot()
  })
  it('should call installationID and display it', async () => {
    const { queryByText } = render(<CheatCodes navigation={navigation} />)
    expect(BatchUser.getInstallationID).toHaveBeenCalled()
    await waitFor(() => expect(queryByText(installationID)).toBeTruthy())
  })
})
