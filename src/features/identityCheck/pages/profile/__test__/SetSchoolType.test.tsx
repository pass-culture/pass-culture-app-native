import React from 'react'

import { ActivityIdEnum } from 'api/gen'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { initialIdentityCheckState as mockState } from 'features/identityCheck/context/reducer'
import { SetSchoolType } from 'features/identityCheck/pages/profile/SetSchoolType'
import { render } from 'tests/utils'

jest.mock('features/auth/api')
jest.mock('features/identityCheck/context/IdentityCheckContextProvider', () => ({
  useIdentityCheckContext: jest.fn(() => ({
    dispatch: jest.fn(),
    ...mockState,
  })),
}))

jest.mock('features/identityCheck/utils/useProfileOptions')

const mockUseIdentityCheckContext = useIdentityCheckContext as jest.Mock

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
})
