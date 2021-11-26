import React from 'react'

import { IdentityCheckHonor } from 'features/identityCheck/pages/confirmation/IdentityCheckHonor'
import { render } from 'tests/utils'

describe('<IdentityCheckHonor/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<IdentityCheckHonor />)
    expect(renderAPI).toMatchSnapshot()
  })
})
