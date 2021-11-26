import React from 'react'

import { IdentityCheckEnd } from 'features/identityCheck/pages/identification/IdentityCheckEnd'
import { render } from 'tests/utils'

describe('<IdentityCheckEnd/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<IdentityCheckEnd />)
    expect(renderAPI).toMatchSnapshot()
  })
})
