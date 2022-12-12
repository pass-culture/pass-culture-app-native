import React from 'react'

import { IdentityCheckDMS } from 'features/identityCheck/pages/identification/dms/IdentityCheckDMS'
import { render } from 'tests/utils'

describe('<IdentityCheckDMS />', () => {
  it('should render correctly', () => {
    const renderAPI = render(<IdentityCheckDMS />)
    expect(renderAPI).toMatchSnapshot()
  })
})
