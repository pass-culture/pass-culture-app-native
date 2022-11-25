import React from 'react'

import { OfferTypeModal } from 'features/search/pages/modals/OfferTypeModal/OfferTypeModal'
import { checkAccessibilityFor, render } from 'tests/utils/web'

jest.mock('react-query')

jest.mock('features/profile/api', () => ({
  useUserProfileInfo: jest.fn(() => ({
    data: {
      isBeneficiary: true,
      domainsCredit: { all: { initial: 8000, remaining: 7000 } },
    },
  })),
}))

jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: false })),
}))

const hideOfferTypeModal = jest.fn()

describe('<OfferTypeModal/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <OfferTypeModal
          title="Type d'offre"
          accessibilityLabel="Ne pas filtrer sur les type d'offre et retourner aux résultats"
          isVisible
          hideModal={hideOfferTypeModal}
        />
      )
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
