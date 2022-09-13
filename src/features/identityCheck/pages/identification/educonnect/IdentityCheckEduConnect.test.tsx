import React from 'react'

import { initialIdentityCheckState as mockState } from 'features/identityCheck/context/reducer'
import { IdentityCheckEduConnect } from 'features/identityCheck/pages/identification/educonnect/IdentityCheckEduConnect'
import { render } from 'tests/utils'

jest.mock('features/identityCheck/useIdentityCheckNavigation')
jest.mock('features/identityCheck/context/IdentityCheckContextProvider', () => ({
  useIdentityCheckContext: jest.fn(() => ({
    dispatch: jest.fn(),
    ...mockState,
  })),
}))

describe('<IdentityCheckEduConnect />', () => {
  it('should render correctly', () => {
    const renderAPI = render(<IdentityCheckEduConnect />)
    expect(renderAPI).toMatchSnapshot()
  })
})
