import React from 'react'

import { ActivityIdEnum } from 'api/gen'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { SchoolTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedSchoolTypes'
import { SetSchoolType } from 'features/identityCheck/pages/profile/SetSchoolType'
import { amplitude } from 'libs/amplitude'
import { fireEvent, render, waitFor } from 'tests/utils'

jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({
    dispatch: jest.fn(),
    ...mockState,
  })),
}))

let mockIsSavingCheckpoint = false
jest.mock('features/identityCheck/pages/helpers/useSubscriptionNavigation', () => ({
  useSubscriptionNavigation: () => ({
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

const mockUseIdentityCheckContext = useSubscriptionContext as jest.Mock

jest.mock('react-query')

mockUseIdentityCheckContext.mockImplementation(() => ({
  dispatch: jest.fn(),
  ...mockState,
  profile: { ...mockState.profile, status: ActivityIdEnum.MIDDLE_SCHOOL_STUDENT },
}))

describe('<SetSchoolType />', () => {
  it('shoud render a list of middle school types if profile.status is middleSchoolStudent', () => {
    const renderAPI = render(<SetSchoolType />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('shoud render a list of high school types if profile.status is highSchoolStudent', () => {
    mockUseIdentityCheckContext.mockImplementationOnce(() => ({
      dispatch: jest.fn(),
      ...mockState,
      profile: { ...mockState.profile, status: ActivityIdEnum.HIGH_SCHOOL_STUDENT },
    }))

    const renderAPI = render(<SetSchoolType />)
    expect(renderAPI).toMatchSnapshot()
  })
  it('should not display "Continuer" if isSavingCheckpoint is true', async () => {
    mockIsSavingCheckpoint = true
    const { queryByText, getByText } = render(<SetSchoolType />)

    fireEvent.press(getByText(SchoolTypesSnap.school_types[3].label))
    expect(queryByText('Continuer')).toBeFalsy()
  })

  it('should send a amplitude event when the screen is mounted', async () => {
    render(<SetSchoolType />)

    await waitFor(() =>
      expect(amplitude.logEvent).toHaveBeenNthCalledWith(1, 'screen_view_set_school_type')
    )
  })

  it('should send a amplitude event set_school_type_clicked on press Continuer', async () => {
    mockIsSavingCheckpoint = false
    const { getByText } = render(<SetSchoolType />)

    fireEvent.press(getByText(SchoolTypesSnap.school_types[3].label))
    fireEvent.press(getByText('Continuer'))

    await waitFor(() =>
      // first call will be the event screen_view_set_school_type on mount
      expect(amplitude.logEvent).toHaveBeenNthCalledWith(1, 'screen_view_set_school_type')
    )
  })
})
