import React from 'react'

import { OfferResponse } from 'api/gen'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { Offer } from 'features/offer/pages/Offer/Offer'
import { checkAccessibilityFor, render } from 'tests/utils/web'

jest.mock('react-query')

const mockedOffer: Partial<OfferResponse> | undefined = offerResponseSnap
jest.mock('features/offer/api/useOffer', () => ({
  useOffer: () => ({
    data: mockedOffer,
  }),
}))

const mockV4 = jest.fn()
jest.mock('uuid', () => ({
  v1: jest.fn(),
  v4: jest.fn(mockV4),
}))

describe('Accessibility', () => {
  it('should not have basic accessibility issues', async () => {
    mockV4.mockReturnValueOnce('offerId')
    const { container } = await render(<Offer />)
    const results = await checkAccessibilityFor(container)

    expect(results).toHaveNoViolations()
  })
})
