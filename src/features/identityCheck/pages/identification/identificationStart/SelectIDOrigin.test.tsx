import React from 'react'

import { initialIdentityCheckState as mockState } from 'features/identityCheck/context/reducer'
import { SelectIDOrigin } from 'features/identityCheck/pages/identification/identificationStart/SelectIDOrigin'
import { render } from 'tests/utils'

jest.mock('features/identityCheck/context/IdentityCheckContextProvider', () => ({
  useIdentityCheckContext: jest.fn(() => ({
    dispatch: jest.fn(),
    ...mockState,
  })),
}))
describe('SelectIDOrigin', () => {
  it('should render correctly', () => {
    const renderAPI = render(<SelectIDOrigin />)
    expect(renderAPI).toMatchSnapshot()
  })
})
