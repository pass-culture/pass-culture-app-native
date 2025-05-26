import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { SetCity } from 'features/identityCheck/pages/profile/SetCity'
import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render, screen, waitFor } from 'tests/utils/web'

jest.mock('uuid', () => ({
  v1: jest.fn(),
  v4: jest.fn(),
}))

jest.mock('features/identityCheck/context/SubscriptionContextProvider')
jest.mock('ui/theme/customFocusOutline/customFocusOutline')

describe('<SetCity/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = renderSetCity({ type: ProfileTypes.IDENTITY_CHECK })

      await waitFor(() => {
        expect(screen.getByTestId('Entrée pour la ville')).toHaveFocus()
      })

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

const renderSetCity = (navigationParams: { type: string }) => {
  const navProps = { route: { params: navigationParams } } as StackScreenProps<
    SubscriptionRootStackParamList,
    'SetCity'
  >
  return render(reactQueryProviderHOC(<SetCity {...navProps} />))
}
