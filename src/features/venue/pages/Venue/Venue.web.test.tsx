import mockdate from 'mockdate'
import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { Venue } from 'features/venue/pages/Venue/Venue'
import { checkAccessibilityFor, render } from 'tests/utils/web'

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('react-query')
jest.mock('features/venue/api/useVenue')
jest.mock('features/venue/api/useVenueOffers')

const mockV4 = jest.fn()
jest.mock('uuid', () => ({
  v1: jest.fn(),
  v4: jest.fn(mockV4),
}))

const venueId = venueResponseSnap.id

describe('<Venue />', () => {
  useRoute.mockImplementation(() => ({ params: { venueId } }))

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      mockV4
        .mockReturnValueOnce('withdrawalTermsAccordionID')
        .mockReturnValueOnce('accessibilityAccordionID')
        .mockReturnValueOnce('contactAccordionID')
      const { container } = await render(<Venue />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
