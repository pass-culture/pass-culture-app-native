import React from 'react'

import { Status } from 'features/identityCheck/pages/profile/Status'
import { render } from 'tests/utils'

jest.mock('features/auth/api')

const mockSettings = {
  enableUnderageGeneralisation: false,
  enableNativeEacIndividual: false,
}
jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => ({
    data: mockSettings,
  })),
}))

describe('<Status/>', () => {
  it('should render correctly with no Collégien status', () => {
    const renderAPI = render(<Status />)
    expect(renderAPI).toMatchSnapshot()
  })
  it('should show Collégien if enabledGeneralisation is true', () => {
    mockSettings.enableNativeEacIndividual = true
    mockSettings.enableUnderageGeneralisation = true
    const { getByText } = render(<Status />)

    expect(getByText('Collégien')).toBeTruthy()
  })
})
