import React from 'react'

import { ActivityEnum } from 'api/gen'
import { Status } from 'features/identityCheck/pages/profile/Status'
import { fireEvent, render } from 'tests/utils'

jest.mock('features/auth/api')
jest.mock('features/identityCheck/context/IdentityCheckContextProvider', () => ({
  useIdentityCheckContext: jest.fn(() => ({ dispatch: jest.fn() })),
}))

const mockSettings = {
  enableUnderageGeneralisation: false,
  enableNativeEacIndividual: false,
}
jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => ({
    data: mockSettings,
  })),
}))

const mockNavigateToNextScreen = jest.fn()
jest.mock('features/identityCheck/useIdentityCheckNavigation', () => ({
  useIdentityCheckNavigation: () => ({
    navigateToNextScreen: mockNavigateToNextScreen,
  }),
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

  it('should navigate to next screen on press "Continuer"', () => {
    const { getByText } = render(<Status />)

    fireEvent.press(getByText(ActivityEnum.Tudiant))
    fireEvent.press(getByText('Continuer'))

    expect(mockNavigateToNextScreen).toHaveBeenCalledTimes(1)
  })
})
