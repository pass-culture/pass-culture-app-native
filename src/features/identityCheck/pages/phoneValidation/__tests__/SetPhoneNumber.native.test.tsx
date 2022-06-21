import React from 'react'

import { SetPhoneNumber } from 'features/identityCheck/pages/phoneValidation/SetPhoneNumber'
import { render } from 'tests/utils'

describe('SetPhoneNumber', () => {
  it('should match snapshot', () => {
    const SetPhoneNumberPage = render(<SetPhoneNumber />)
    expect(SetPhoneNumberPage).toMatchSnapshot()
  })

  it('should show modal on first render', () => {
    const { queryByText } = render(<SetPhoneNumber />)
    expect(queryByText("J'ai compris")).toBeTruthy()
  })

  // TODO PC-14869 : implement the check that modal is visible when going to SetPhoneValiditationCode then using GoBack
})
