import React from 'react'

import { Status } from 'features/identityCheck/pages/profile/Status'
import { render } from 'tests/utils'

describe('<Status/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<Status />)
    expect(renderAPI).toMatchSnapshot()
  })
})
