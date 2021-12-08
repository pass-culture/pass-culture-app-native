import React from 'react'

import { IdentityCheckUnavailable } from 'features/identityCheck/pages/identification/IdentityCheckUnavailable'
import { render } from 'tests/utils'

jest.mock('@react-navigation/native')
describe('<IdentityCheckUnavailable />', () => {
  it('should render correctly', () => {
    const renderAPI = render(<IdentityCheckUnavailable />)
    expect(renderAPI).toMatchSnapshot()
  })
})
