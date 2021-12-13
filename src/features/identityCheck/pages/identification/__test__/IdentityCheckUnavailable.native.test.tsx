import React from 'react'

import { IdentityCheckUnavailable } from 'features/identityCheck/pages/identification/IdentityCheckUnavailable'
import { render } from 'tests/utils'

describe('<IdentityCheckUnavailable />', () => {
  it('should render correctly', () => {
    const renderAPI = render(<IdentityCheckUnavailable />)
    expect(renderAPI).toMatchSnapshot()
  })
})
