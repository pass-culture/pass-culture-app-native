import React from 'react'

import { FilterBehaviour } from 'features/search/enums'
import { OfferDuoModal } from 'features/search/pages/modals/OfferDuoModal/OfferDuoModal'
import { checkAccessibilityFor, render } from 'tests/utils/web'

jest.mock('features/auth/context/AuthContext')

describe('<OfferDuoModal/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <OfferDuoModal
          title="Duo"
          accessibilityLabel="Ne pas filtrer sur les offres duo et retourner aux résultats"
          isVisible
          hideModal={jest.fn()}
          filterBehaviour={FilterBehaviour.SEARCH}
        />
      )
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
