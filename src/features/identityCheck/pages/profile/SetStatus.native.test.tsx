import React from 'react'

import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { SchoolTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedSchoolTypes'
import { activityHasSchoolTypes } from 'features/identityCheck/pages/profile/helpers/schoolTypes'
import { SetStatus } from 'features/identityCheck/pages/profile/SetStatus'
import * as UnderageUserAPI from 'features/profile/helpers/useIsUserUnderage'
import { analytics } from 'libs/analytics'
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

jest.mock('features/profile/helpers/useIsUserUnderage')
const mockedUseIsUserUnderage = jest.spyOn(UnderageUserAPI, 'useIsUserUnderage')

describe('<SetStatus/>', () => {
  it('should render correctly', () => {
    mockedUseIsUserUnderage.mockReturnValueOnce(true)
    renderSetStatus()

    expect(screen).toMatchSnapshot()
  })

  // TODO(PC-12410): déléguer la responsabilité au back de faire cette filtration
  it('should render with no Collégien status if user is over 18', () => {
    mockedUseIsUserUnderage.mockReturnValueOnce(false)
    renderSetStatus()

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

  it('should log screen view when the screen is mounted', async () => {
    renderSetStatus()

    await waitFor(() => expect(analytics.logScreenViewSetStatus).toHaveBeenCalledTimes(1))
  })

  it('should log analytics on press Continuer', async () => {
    mockIsSavingCheckpoint = false
    renderSetStatus()

    fireEvent.press(screen.getByText(SchoolTypesSnap.activities[1].label))
    fireEvent.press(screen.getByText('Continuer'))

    await waitFor(() => {
      expect(analytics.logSetStatusClicked).toHaveBeenCalledTimes(1)
    })
  })
})

function renderSetStatus() {
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<SetStatus />))
}
