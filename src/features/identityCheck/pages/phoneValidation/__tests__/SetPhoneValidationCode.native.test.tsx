import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { SetPhoneValidationCode } from 'features/identityCheck/pages/phoneValidation/SetPhoneValidationCode'
import { IdentityCheckRootStackParamList } from 'features/navigation/RootNavigator'
import { render } from 'tests/utils'

const navigationProps = {
  route: {
    params: {
      phoneNumber: '0612345678',
      countryCode: 'FR',
    },
  },
} as StackScreenProps<IdentityCheckRootStackParamList, 'SetPhoneValidationCode'>

describe('SetPhoneValidationCode', () => {
  it('should match snapshot', () => {
    const SetPhoneValidationCodePage = render(<SetPhoneValidationCode {...navigationProps} />)
    expect(SetPhoneValidationCodePage).toMatchSnapshot()
  })
})
