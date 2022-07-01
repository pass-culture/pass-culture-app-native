import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { SetPhoneValidationCode } from 'features/identityCheck/pages/phoneValidation/SetPhoneValidationCode'
import { IdentityCheckRootStackParamList } from 'features/navigation/RootNavigator'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render } from 'tests/utils'

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
    const SetPhoneValidationCodePage = renderSetPhoneValidationCode()
    expect(SetPhoneValidationCodePage).toMatchSnapshot()
  })

  it("should have modal closed on render, and open modal when clicking on 'code non reçu'", async () => {
    const CodePage = renderSetPhoneValidationCode()

    expect(CodePage.queryByText('Demander un autre code')).toBeFalsy()

    fireEvent.press(CodePage.getByText('Code non reçu\u00a0?'))

    expect(CodePage.queryByText('Demander un autre code')).toBeTruthy()
  })
})

function renderSetPhoneValidationCode() {
  return render(<SetPhoneValidationCode {...navigationProps} />, {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
