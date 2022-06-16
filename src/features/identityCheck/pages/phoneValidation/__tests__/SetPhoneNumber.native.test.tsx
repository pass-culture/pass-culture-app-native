import React from 'react'

import { SetPhoneNumber } from 'features/identityCheck/pages/phoneValidation/SetPhoneNumber'
import { render } from 'tests/utils'

describe('SetPhoneNumber', () => {
  it('should match snapshot', () => {
    const SetPhoneNumberPage = render(<SetPhoneNumber />)
    expect(SetPhoneNumberPage).toMatchSnapshot()
  })
})
