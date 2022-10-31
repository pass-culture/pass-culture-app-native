import React from 'react'

import { ActivityIdEnum } from 'api/gen'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { SchoolTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedSchoolTypes'
import { SetSchoolType } from 'features/identityCheck/pages/profile/SetSchoolType'
import { fireEvent, render } from 'tests/utils'

jest.mock('features/auth/api')
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({
    dispatch: jest.fn(),
    ...mockState,
  })),
}))

let mockIsSavingCheckpoint = false
jest.mock('features/identityCheck/useSubscriptionNavigation', () => ({
  useSubscriptionNavigation: () => ({
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

const mockUseIdentityCheckContext = useSubscriptionContext as jest.Mock

jest.mock('react-query')

describe('<SetSchoolType />', () => {
  beforeEach(jest.clearAllMocks)

  it('shoud render a list of middle school types if profile.status is middleSchoolStudent', () => {
    mockUseIdentityCheckContext.mockImplementationOnce(() => ({
      dispatch: jest.fn(),
      ...mockState,
      profile: { ...mockState.profile, status: ActivityIdEnum.MIDDLE_SCHOOL_STUDENT },
    }))

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
    mockUseIdentityCheckContext.mockImplementationOnce(() => ({
      dispatch: jest.fn(),
      ...mockState,
      profile: { ...mockState.profile, status: ActivityIdEnum.MIDDLE_SCHOOL_STUDENT },
    }))
    mockIsSavingCheckpoint = true
    const { queryByText, getByText } = render(<SetSchoolType />)

    fireEvent.press(getByText(SchoolTypesSnap.school_types[3].label))
    expect(queryByText('Continuer')).toBeFalsy()
  })
})
