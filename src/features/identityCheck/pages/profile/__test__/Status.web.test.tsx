import React from 'react'
import waitForExpect from 'wait-for-expect'

import { initialIdentityCheckState as mockState } from 'features/identityCheck/context/reducer'
import { SchoolTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedSchoolTypes'
import { Status } from 'features/identityCheck/pages/profile/Status'
import { activityHasSchoolTypes } from 'features/identityCheck/pages/profile/utils'
import { useIsUserUnderage } from 'features/profile/utils'
import { fireEvent, render } from 'tests/utils/web'

jest.mock('features/auth/api')
jest.mock('features/identityCheck/context/IdentityCheckContextProvider', () => ({
  useIdentityCheckContext: jest.fn(() => ({ dispatch: jest.fn(), ...mockState })),
}))
jest.mock('react-query')
jest.mock('features/identityCheck/utils/useProfileOptions')
jest.mock('features/profile/utils')
jest.mock('features/identityCheck/pages/profile/utils')

const mockNavigateToNextScreen = jest.fn()
jest.mock('features/identityCheck/useIdentityCheckNavigation', () => ({
  useIdentityCheckNavigation: () => ({
    navigateToNextScreen: mockNavigateToNextScreen,
  }),
}))

const mockUseIsUserUnderage = useIsUserUnderage as jest.Mock

describe('<Status/>', () => {
  beforeEach(jest.clearAllMocks)

  it('should render correctly', () => {
    mockUseIsUserUnderage.mockReturnValueOnce(true)
    const renderAPI = render(<Status />)
    expect(renderAPI).toMatchSnapshot()
  })
  // TODO PC-12410 : déléguer la responsabilité au back de faire cette filtration
  it('should render with no Collégien status if user is over 18', () => {
    mockUseIsUserUnderage.mockReturnValueOnce(false)
    const { queryByText } = render(<Status />)
    expect(queryByText(SchoolTypesSnap.activities[0].label)).toBe(null)
  })

  it('should navigate to next screen on press "Continuer"', async () => {
    const { getByText } = render(<Status />)

    fireEvent.click(getByText(SchoolTypesSnap.activities[1].label))
    fireEvent.click(getByText('Continuer'))
    await waitForExpect(() => {
      expect(mockNavigateToNextScreen).toHaveBeenCalledTimes(1)
    })
  })
  it('should not check if activityHasSchoolTypes if user is over 18', () => {
    mockUseIsUserUnderage.mockReturnValueOnce(false)
    const { getByText } = render(<Status />)

    fireEvent.click(getByText(SchoolTypesSnap.activities[1].label))
    expect(activityHasSchoolTypes).not.toHaveBeenCalled()
  })
  it('should check if activityHasSchoolTypes if user is underage', () => {
    mockUseIsUserUnderage.mockReturnValueOnce(true)
    mockUseIsUserUnderage.mockReturnValueOnce(true)
    const { getByText } = render(<Status />)

    fireEvent.click(getByText(SchoolTypesSnap.activities[0].label))
    expect(activityHasSchoolTypes).toHaveBeenCalled()
  })
})
