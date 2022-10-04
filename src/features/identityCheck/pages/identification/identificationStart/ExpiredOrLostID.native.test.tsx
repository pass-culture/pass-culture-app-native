import React from 'react'

import { ExpiredOrLostID } from 'features/identityCheck/pages/identification/identificationStart/ExpiredOrLostID'
import { render } from 'tests/utils'

describe('ExpiredOrLostID', () => {
  it('should render correctly', () => {
    const ExpiredOrLostIDPage = render(<ExpiredOrLostID />)
    expect(ExpiredOrLostIDPage).toMatchSnapshot()
  })
})
