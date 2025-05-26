import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { SettingsWrapper } from 'features/auth/context/SettingsContext'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { SetAddress } from 'features/identityCheck/pages/profile/SetAddress'
import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render, screen, waitFor } from 'tests/utils/web'

jest.mock('uuid', () => ({
  v1: jest.fn(),
  v4: jest.fn(),
}))

jest.mock('features/identityCheck/context/SubscriptionContextProvider')
jest.mock('ui/theme/customFocusOutline/customFocusOutline')

describe('<SetAddress/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = renderSetAddress({ type: ProfileTypes.IDENTITY_CHECK })

      await waitFor(() => {
        expect(screen.getByTestId('Entrée pour l’adresse')).toHaveFocus()
      })

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

const renderSetAddress = (navigationParams: { type: string }) => {
  const navProps = { route: { params: navigationParams } } as StackScreenProps<
    SubscriptionRootStackParamList,
    'SetAddress'
  >
  return render(
    reactQueryProviderHOC(
      <SettingsWrapper>
        <SetAddress {...navProps} />
      </SettingsWrapper>
    )
  )
}
