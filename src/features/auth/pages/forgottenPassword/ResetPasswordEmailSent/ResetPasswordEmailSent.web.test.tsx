import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { checkAccessibilityFor, render } from 'tests/utils/web'

import { ResetPasswordEmailSent } from './ResetPasswordEmailSent'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

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
} as StackScreenProps<RootStackParamList, 'ResetPasswordEmailSent'>

function renderResetPasswordEmailSent() {
  return render(
    <SafeAreaProvider>
      <ResetPasswordEmailSent {...navigationProps} />
    </SafeAreaProvider>
  )
}
