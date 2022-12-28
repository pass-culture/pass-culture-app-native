import React from 'react'
import waitForExpect from 'wait-for-expect'

import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { SchoolTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedSchoolTypes'
import { SetStatus } from 'features/identityCheck/pages/profile/SetStatus'
import { activityHasSchoolTypes } from 'features/identityCheck/pages/profile/utils'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { amplitude } from 'libs/amplitude'
import { fireEvent, render, waitFor } from 'tests/utils'

jest.mock('features/auth/api')
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({ dispatch: jest.fn(), ...mockState })),
}))
jest.mock('react-query')
jest.mock('features/profile/utils')
jest.mock('features/identityCheck/pages/profile/utils')

const mockNavigateToNextScreen = jest.fn()
let mockIsSavingCheckpoint = false
jest.mock('features/identityCheck/useSubscriptionNavigation', () => ({
  useSubscriptionNavigation: () => ({
    navigateToNextScreen: mockNavigateToNextScreen,
    isSavingCheckpoint: mockIsSavingCheckpoint,
  }),
}))

const mockSchoolTypes = SchoolTypesSnap.school_types
const mockActivities = SchoolTypesSnap.activities
jest.mock('features/identityCheck/api/api', () => {
  const ActualIdentityCheckAPI = jest.requireActual('features/identityCheck/api/api')
  return {
    ...ActualIdentityCheckAPI,
    useProfileOptions: jest.fn(() => {
      return {
        schoolTypes: mockSchoolTypes,
        activities: mockActivities,
      }
    }),
  }
})

const mockUseIsUserUnderage = useIsUserUnderage as jest.Mock

describe('<SetStatus/>', () => {
  it('should render correctly', () => {
    mockUseIsUserUnderage.mockReturnValueOnce(true)
    const renderAPI = render(<SetStatus />)
    expect(renderAPI).toMatchSnapshot()
  })
  // TODO(PC-12410): déléguer la responsabilité au back de faire cette filtration
  it('should render with no Collégien status if user is over 18', () => {
    mockUseIsUserUnderage.mockReturnValueOnce(false)
    const { queryByText } = render(<SetStatus />)
    expect(queryByText(SchoolTypesSnap.activities[0].label)).toBe(null)
  })

  it('should navigate to next screen on press "Continuer"', async () => {
    const { getByText } = render(<SetStatus />)

    fireEvent.press(getByText(SchoolTypesSnap.activities[1].label))
    fireEvent.press(getByText('Continuer'))
    await waitForExpect(() => {
      expect(mockNavigateToNextScreen).toHaveBeenCalledTimes(1)
    })
  })
  it('should not check if activityHasSchoolTypes if user is over 18', () => {
    mockUseIsUserUnderage.mockReturnValueOnce(false)
    const { getByText } = render(<SetStatus />)

    fireEvent.press(getByText(SchoolTypesSnap.activities[1].label))
    expect(activityHasSchoolTypes).not.toHaveBeenCalled()
  })
  it('should check if activityHasSchoolTypes if user is underage', () => {
    mockUseIsUserUnderage.mockReturnValueOnce(true)
    mockUseIsUserUnderage.mockReturnValueOnce(true)
    const { getByText } = render(<SetStatus />)

    fireEvent.press(getByText(SchoolTypesSnap.activities[0].label))
    expect(activityHasSchoolTypes).toHaveBeenCalledTimes(1)
  })

  it('should not display "Continuer" if isSavingCheckpoint is true', async () => {
    mockIsSavingCheckpoint = true
    const { queryByText, getByText } = render(<SetStatus />)

    fireEvent.press(getByText(SchoolTypesSnap.activities[1].label))
    expect(queryByText('Continuer')).toBeFalsy()
  })

  it('should send a amplitude event when the screen is mounted', async () => {
    render(<SetStatus />)

    await waitFor(() =>
      expect(amplitude.logEvent).toHaveBeenNthCalledWith(1, 'screen_view_set_status')
    )
  })
})
