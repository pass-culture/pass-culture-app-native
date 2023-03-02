import React from 'react'

import { OfferResponse } from 'api/gen'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { Offer } from 'features/offer/pages/Offer/Offer'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { act, checkAccessibilityFor, render } from 'tests/utils/web'
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

const mockSubcategories = placeholderData.subcategories
const mockSearchGroups = placeholderData.searchGroups
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      subcategories: mockSubcategories,
      searchGroups: mockSearchGroups,
    },
  }),
}))

describe('<Offer/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      mockV4.mockReturnValueOnce('offerId')
      const { container } = render(<Offer />)

      let results: Awaited<ReturnType<typeof checkAccessibilityFor>> | undefined
      await act(async () => {
        results = await checkAccessibilityFor(container)
      })

      expect(results).toHaveNoViolations()
    })
  })
})
