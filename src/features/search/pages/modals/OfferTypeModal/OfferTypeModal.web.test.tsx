import React from 'react'

import { OfferTypeModal } from 'features/search/pages/modals/OfferTypeModal/OfferTypeModal'
import { checkAccessibilityFor, render } from 'tests/utils/web'

jest.mock('react-query')

jest.mock('features/auth/AuthContext')

describe('<OfferTypeModal/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <OfferTypeModal
          title="Type d'offre"
          accessibilityLabel="Ne pas filtrer sur les type d'offre et retourner aux résultats"
          isVisible
          hideModal={jest.fn()}
        />
      )
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
