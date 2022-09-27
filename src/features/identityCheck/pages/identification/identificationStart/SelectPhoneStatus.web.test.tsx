import React from 'react'

import { SelectPhoneStatus } from 'features/identityCheck/pages/identification/identificationStart/SelectPhoneStatus.web'
import { render } from 'tests/utils'

describe('SelectPhoneStatus', () => {
  it('should render correctly', () => {
    const selectPhoneStatus = render(<SelectPhoneStatus />)
    expect(selectPhoneStatus).toMatchSnapshot()
  })
})
