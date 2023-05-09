import React from 'react'

import { ActivityIdEnum } from 'api/gen'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { SchoolTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedSchoolTypes'
import { SetSchoolType } from 'features/identityCheck/pages/profile/SetSchoolType'
import { analytics } from 'libs/analytics'
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
    const renderAPI = renderSetSchoolType()
    expect(renderAPI).toMatchSnapshot()
  })

  it('shoud render a list of high school types if profile.status is highSchoolStudent', () => {
    mockUseIdentityCheckContext.mockImplementationOnce(() => ({
      dispatch: jest.fn(),
      ...mockState,
      profile: { ...mockState.profile, status: ActivityIdEnum.HIGH_SCHOOL_STUDENT },
    }))

    const renderAPI = renderSetSchoolType()
    expect(renderAPI).toMatchSnapshot()
  })
  it('should not display "Continuer" if isSavingCheckpoint is true', async () => {
    mockIsSavingCheckpoint = true
    const { queryByText, getByText } = render(<SetSchoolType />)

    fireEvent.press(getByText(SchoolTypesSnap.school_types[3].label))
    expect(queryByText('Continuer')).toBeFalsy()
  })

  it('should log screen view when the screen is mounted', async () => {
    renderSetSchoolType()

    await waitFor(() => expect(analytics.logScreenViewSetSchoolType).toHaveBeenCalledTimes(1))
  })

  it('should log analytics on press Continuer', async () => {
    mockIsSavingCheckpoint = false
    const { getByText } = renderSetSchoolType()

    fireEvent.press(getByText(SchoolTypesSnap.school_types[3].label))
    fireEvent.press(getByText('Continuer'))

    await waitFor(() => expect(analytics.logSetSchoolTypeClicked).toHaveBeenCalledTimes(1))
  })
})

function renderSetSchoolType() {
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<SetSchoolType />))
}
