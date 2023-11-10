import { SearchResponse } from '@algolia/client-search'
import mockdate from 'mockdate'
import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import * as useGTLPlaylistsLibrary from 'features/gtlPlaylist/api/gtlPlaylistApi'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { Venue } from 'features/venue/pages/Venue/Venue'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { Offer } from 'shared/offer/types'
import { checkAccessibilityFor, render, act } from 'tests/utils/web'

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('react-query')
jest.mock('features/venue/api/useVenue')
jest.mock('features/venue/api/useVenueOffers')

jest.mock('libs/firebase/firestore/featureFlags/useFeatureFlag')
const mockUseFeatureFlag = useFeatureFlag as jest.MockedFunction<typeof useFeatureFlag>
mockUseFeatureFlag.mockReturnValue(false)

const mockV4 = jest.fn()
jest.mock('uuid', () => ({
  v1: jest.fn(),
  v4: jest.fn(mockV4),
}))

const venueId = venueResponseSnap.id

jest.mock('features/home/helpers/useHomePosition', () => ({
  useHomePosition: jest.fn().mockReturnValue({
    position: {
      latitude: 2,
      longitude: 2,
    },
  }),
}))

jest.mock('features/profile/helpers/useIsUserUnderage', () => ({
  useIsUserUnderage: jest.fn().mockReturnValue(false),
}))

jest.spyOn(useGTLPlaylistsLibrary, 'fetchGTLPlaylists').mockResolvedValue([
  {
    title: 'Test',
    offers: {
      hits: [],
    } as unknown as SearchResponse<Offer>,
    layout: 'one-item-medium',
    entryId: '2xUlLBRfxdk6jeYyJszunX',
  },
])

describe('<Venue />', () => {
  useRoute.mockImplementation(() => ({ params: { venueId } }))

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      mockV4
        .mockReturnValueOnce('withdrawalTermsAccordionID')
        .mockReturnValueOnce('accessibilityAccordionID')
        .mockReturnValueOnce('contactAccordionID')
      const { container } = render(<Venue />)

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })

    it('should not have basic accessibility issues with new version', async () => {
      mockUseFeatureFlag.mockReturnValueOnce(true)
      const { container } = render(<Venue />)

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })

    it('should render correctly in web for new version', async () => {
      mockUseFeatureFlag.mockReturnValueOnce(true)
      const { container } = render(<Venue />)
      await act(async () => {})

      expect(container).toMatchSnapshot()
    })
  })
})
