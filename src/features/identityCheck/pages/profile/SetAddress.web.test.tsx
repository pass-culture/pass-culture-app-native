import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SettingsWrapper } from 'features/auth/context/SettingsContext'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { SetAddress } from 'features/identityCheck/pages/profile/SetAddress'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render } from 'tests/utils/web'

jest.mock('uuid', () => ({
  v1: jest.fn(),
  v4: jest.fn(),
}))

jest.mock('features/identityCheck/context/SubscriptionContextProvider')
jest.mock('ui/theme/customFocusOutline/customFocusOutline')

useRoute.mockReturnValue({
  params: { type: ProfileTypes.IDENTITY_CHECK },
})

describe('<SetAddress/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = renderSetAddress()

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

const renderSetAddress = () => {
  return render(
    reactQueryProviderHOC(
      <SettingsWrapper>
        <SetAddress />
      </SettingsWrapper>
    )
  )
}
