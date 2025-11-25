import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { RootStackParamList } from 'features/navigation/navigators/RootNavigator/types'
import { checkAccessibilityFor, render } from 'tests/utils/web'

import { ResetPasswordEmailSent } from './ResetPasswordEmailSent'

jest.mock('libs/firebase/analytics/analytics')

describe('<ResetPasswordEmailSent/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = renderResetPasswordEmailSent()

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

const navigationProps = {
  route: { params: { email: 'john.doe@gmail.com' } },
} as NativeStackScreenProps<RootStackParamList, 'ResetPasswordEmailSent'>

function renderResetPasswordEmailSent() {
  return render(
    <SafeAreaProvider>
      <ResetPasswordEmailSent {...navigationProps} />
    </SafeAreaProvider>
  )
}
