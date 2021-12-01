import React from 'react'

import { IdentityCheckEduConnect } from 'features/identityCheck/pages/identification/IdentityCheckEduConnect'
import { render } from 'tests/utils'

describe('<IdentityCheckEduConnect />', () => {
  it('should render correctly', () => {
    const renderAPI = render(<IdentityCheckEduConnect />)
    expect(renderAPI).toMatchSnapshot()
  })
})
