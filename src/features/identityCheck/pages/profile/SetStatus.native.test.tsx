import React from 'react'

import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { SchoolTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedSchoolTypes'
import { activityHasSchoolTypes } from 'features/identityCheck/pages/profile/helpers/schoolTypes'
import { SetStatus } from 'features/identityCheck/pages/profile/SetStatus'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { amplitude } from 'libs/amplitude'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

jest.mock('react-query')
jest.mock('features/profile/helpers/useIsUserUnderage')
jest.mock('features/identityCheck/pages/profile/helpers/schoolTypes')
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({ dispatch: jest.fn(), ...mockState })),
}))

const mockNavigateToNextScreen = jest.fn()
let mockIsSavingCheckpoint = false
jest.mock('features/identityCheck/pages/helpers/useSubscriptionNavigation', () => ({
  useSubscriptionNavigation: () => ({
    navigateToNextScreen: mockNavigateToNextScreen,
    isSavingCheckpoint: mockIsSavingCheckpoint,
  }),
}))

const mockSchoolTypes = SchoolTypesSnap.school_types
const mockActivities = SchoolTypesSnap.activities
jest.mock('features/identityCheck/api/useProfileOptions', () => {
  return {
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
    render(<SetStatus />)

    expect(screen).toMatchSnapshot()
  })

  // TODO(PC-12410): déléguer la responsabilité au back de faire cette filtration
  it('should render with no Collégien status if user is over 18', () => {
    mockUseIsUserUnderage.mockReturnValueOnce(false)
    render(<SetStatus />)

    expect(screen.queryByText(SchoolTypesSnap.activities[0].label)).toBe(null)
  })

  it('should navigate to next screen on press "Continuer"', async () => {
    render(<SetStatus />)

    fireEvent.press(screen.getByText(SchoolTypesSnap.activities[1].label))
    fireEvent.press(screen.getByText('Continuer'))

    await waitFor(() => {
      expect(mockNavigateToNextScreen).toHaveBeenCalledTimes(1)
    })
  })

  it('should not check if activityHasSchoolTypes if user is over 18', () => {
    mockUseIsUserUnderage.mockReturnValueOnce(false)
    render(<SetStatus />)

    fireEvent.press(screen.getByText(SchoolTypesSnap.activities[1].label))

    expect(activityHasSchoolTypes).not.toHaveBeenCalled()
  })

  it('should check if activityHasSchoolTypes if user is underage', () => {
    mockUseIsUserUnderage.mockReturnValueOnce(true)
    mockUseIsUserUnderage.mockReturnValueOnce(true)
    render(<SetStatus />)

    fireEvent.press(screen.getByText(SchoolTypesSnap.activities[0].label))

    expect(activityHasSchoolTypes).toHaveBeenCalledTimes(1)
  })

  it('should not display "Continuer" if isSavingCheckpoint is true', () => {
    mockIsSavingCheckpoint = true
    render(<SetStatus />)

    fireEvent.press(screen.getByText(SchoolTypesSnap.activities[1].label))

    expect(screen.queryByText('Continuer')).toBeFalsy()
  })

  it('should send a amplitude event when the screen is mounted', async () => {
    render(<SetStatus />)

    await waitFor(() =>
      expect(amplitude.logEvent).toHaveBeenNthCalledWith(1, 'screen_view_set_status')
    )
  })

  it('should send a amplitude event set_status_clicked on press Continuer', async () => {
    mockIsSavingCheckpoint = false
    render(<SetStatus />)

    fireEvent.press(screen.getByText(SchoolTypesSnap.activities[1].label))
    fireEvent.press(screen.getByText('Continuer'))

    await waitFor(() => {
      // first call will be the event screen_view_set_status on mount
      expect(amplitude.logEvent).toHaveBeenNthCalledWith(2, 'set_status_clicked')
    })
  })
})
