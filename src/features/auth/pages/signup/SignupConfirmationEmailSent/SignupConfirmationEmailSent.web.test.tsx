import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { SignupConfirmationEmailSent } from './SignupConfirmationEmailSent'

describe('<SignupConfirmationEmailSent/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = renderSignupConfirmationEmailSent()

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

const navigationProps = {
  route: { params: { email: 'john.doe@gmail.com' } },
} as StackScreenProps<RootStackParamList, 'SignupConfirmationEmailSent'>

function renderSignupConfirmationEmailSent() {
  return render(
    <SafeAreaProvider>
      <SignupConfirmationEmailSent {...navigationProps} />
    </SafeAreaProvider>
  )
}
