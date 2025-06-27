import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { render, checkAccessibilityFor, waitFor, screen } from 'tests/utils/web'

import { SetName } from './SetName'

jest.mock('libs/subcategories/useSubcategory')

jest.mock('uuid', () => ({
  v1: jest.fn(),
  v4: jest.fn(),
}))

jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: () => ({ dispatch: jest.fn(), ...mockState }),
}))

useRoute.mockReturnValue({
  params: { type: ProfileTypes.IDENTITY_CHECK },
})

describe('<SetName/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = renderSetName()

      await waitFor(() => {
        expect(screen.getByTestId('Entrée pour le prénom')).toHaveFocus()
      })

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

const renderSetName = () => {
  return render(<SetName />)
}
