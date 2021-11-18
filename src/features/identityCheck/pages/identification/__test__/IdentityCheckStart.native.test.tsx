import React from 'react'

import { IdentityCheckStart } from 'features/identityCheck/pages/identification/IdentityCheckStart'
import { render } from 'tests/utils'

describe('<IdentityCheckStart/>', () => {
  it('should render correctly', async () => {
    const renderAPI = render(<IdentityCheckStart />)
    expect(renderAPI).toMatchSnapshot()
  })
})
