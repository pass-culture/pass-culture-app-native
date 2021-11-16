import React from 'react'

import { IdentityCheckEnd } from 'features/identityCheck/pages/IdentityCheckEnd'
import { render } from 'tests/utils'

describe('<IdentityCheckEnd/>', () => {
  it('should render correctly', async () => {
    const renderAPI = render(<IdentityCheckEnd />)
    expect(renderAPI).toMatchSnapshot()
  })
})
