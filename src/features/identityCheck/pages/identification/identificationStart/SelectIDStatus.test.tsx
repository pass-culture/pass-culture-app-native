import React from 'react'

import { SelectIDStatus } from 'features/identityCheck/pages/identification/identificationStart/SelectIDStatus'
import { render } from 'tests/utils'

describe('SelectIDStatus', () => {
  it('should render SelectIDStatus page correctly', () => {
    const renderAPI = render(<SelectIDStatus />)
    expect(renderAPI).toMatchSnapshot()
  })
})
