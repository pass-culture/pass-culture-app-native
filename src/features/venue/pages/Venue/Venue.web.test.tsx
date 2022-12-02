import mockdate from 'mockdate'
import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { Venue } from 'features/venue/pages/Venue/Venue'
import { checkAccessibilityFor, render, waitFor } from 'tests/utils/web'

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('react-query')
jest.mock('features/auth/settings')
jest.mock('features/venue/api/useVenue')
jest.mock('features/venue/api/useVenueOffers')

const venueId = venueResponseSnap.id

// eslint-disable-next-line local-rules/no-allow-console
allowConsole({ warn: true })

describe('<Venue />', () => {
  beforeEach(() => {
    useRoute.mockImplementation(() => ({ params: { venueId } }))
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<Venue />)
      await waitFor(() => container)

      const results = await checkAccessibilityFor(container, {
        rules: {
          // TODO(PC-18902): throw an error because the UUIDV4 mock return "testUuidV4"
          'duplicate-id-aria': { enabled: false }, // error: "IDs used in ARIA and labels must be unique (duplicate-id-aria)"
        },
      })

      expect(results).toHaveNoViolations()
    })
  })
})
