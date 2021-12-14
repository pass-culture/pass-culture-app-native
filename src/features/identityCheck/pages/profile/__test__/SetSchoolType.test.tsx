import React from 'react'

import { initialIdentityCheckState as mockState } from 'features/identityCheck/context/reducer'
import { SetSchoolType } from 'features/identityCheck/pages/profile/SetSchoolType'
import { render } from 'tests/utils'

jest.mock('features/auth/api')
jest.mock('features/identityCheck/context/IdentityCheckContextProvider', () => ({
  useIdentityCheckContext: jest.fn(() => ({ dispatch: jest.fn(), ...mockState })),
}))

jest.mock('react-query')

describe('<SetSchoolType />', () => {
  it('should render correctly', () => {
    const renderAPI = render(<SetSchoolType />)
    expect(renderAPI).toMatchSnapshot()
  })
})
