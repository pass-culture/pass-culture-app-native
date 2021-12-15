import React from 'react'
import waitForExpect from 'wait-for-expect'

import { initialIdentityCheckState as mockState } from 'features/identityCheck/context/reducer'
import { SchoolTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedSchoolTypes'
import { Status } from 'features/identityCheck/pages/profile/Status'
import { fireEvent, render } from 'tests/utils'

jest.mock('features/auth/api')
jest.mock('features/identityCheck/context/IdentityCheckContextProvider', () => ({
  useIdentityCheckContext: jest.fn(() => ({ dispatch: jest.fn(), ...mockState })),
}))
jest.mock('react-query')
jest.mock('features/identityCheck/utils/useProfileOptions')

const mockNavigateToNextScreen = jest.fn()
jest.mock('features/identityCheck/useIdentityCheckNavigation', () => ({
  useIdentityCheckNavigation: () => ({
    navigateToNextScreen: mockNavigateToNextScreen,
  }),
}))

describe('<Status/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<Status />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate to next screen on press "Continuer"', async () => {
    const { getByText } = render(<Status />)

    fireEvent.press(getByText(SchoolTypesSnap.activities[0].label))
    fireEvent.press(getByText('Continuer'))
    await waitForExpect(() => {
      expect(mockNavigateToNextScreen).toHaveBeenCalledTimes(1)
    })
  })
})
