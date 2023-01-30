import React from 'react'

import { OfferResponse } from 'api/gen'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { OfferDescription } from 'features/offer/pages/OfferDescription/OfferDescription'
import { checkAccessibilityFor, render } from 'tests/utils/web'

const mockedOffer: Partial<OfferResponse> | undefined = offerResponseSnap
jest.mock('features/offer/api/useOffer', () => ({
  useOffer: () => ({
    data: mockedOffer,
  }),
}))

describe('Accessibility', () => {
  it('should not have basic accessibility issues', async () => {
    const { container } = await render(<OfferDescription />)
    const results = await checkAccessibilityFor(container)

    expect(results).toHaveNoViolations()
  })
})
