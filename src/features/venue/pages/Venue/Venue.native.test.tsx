import { SearchResponse } from '@algolia/client-search'
import mockdate from 'mockdate'
import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import * as useGTLPlaylistsLibrary from 'features/gtlPlaylist/api/gtlPlaylistApi'
import { Referrals } from 'features/navigation/RootNavigator/types'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { Venue } from 'features/venue/pages/Venue/Venue'
import { analytics } from 'libs/analytics'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { Offer } from 'shared/offer/types'
import {
  render,
  screen,
  bottomScrollEvent,
  waitFor,
  fireEvent,
  middleScrollEvent,
} from 'tests/utils'

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('react-query')
jest.mock('features/venue/api/useVenue')
jest.mock('features/venue/api/useVenueOffers')

const mockSubcategories = placeholderData.subcategories
const mockHomepageLabels = placeholderData.homepageLabels
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      subcategories: mockSubcategories,
      homepageLabels: mockHomepageLabels,
    },
  }),
}))
const venueId = venueResponseSnap.id

const BATCH_TRIGGER_DELAY_IN_MS = 5000

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
  },
])

jest.useFakeTimers({ legacyFakeTimers: true })

describe('<Venue />', () => {
  it('should match snapshot', async () => {
    const venue = await renderVenue(venueId)
    expect(venue).toMatchSnapshot()
  })

  it('should log consult venue when URL has from param with deeplink', async () => {
    await renderVenue(venueId, 'deeplink')
    expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
      venueId,
      from: 'deeplink',
    })
  })

  it('should not log consult venue when URL has "from" param with something other than deeplink', async () => {
    await renderVenue(venueId, 'search')
    expect(analytics.logConsultVenue).not.toHaveBeenCalled()
  })

  it('should not log consult venue when URL has not "from" param', async () => {
    await renderVenue(venueId)
    expect(analytics.logConsultVenue).not.toHaveBeenCalled()
  })

  describe('Batch trigger', () => {
    it('should trigger event after 5 seconds', async () => {
      await renderVenue(venueId)

      jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS)

      expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenVenueForSurvey)
    })

    it('should not trigger event before 5 seconds have elapsed', async () => {
      await renderVenue(venueId)

      jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS - 1)

      expect(BatchUser.trackEvent).not.toHaveBeenCalled()
    })

    it('should trigger event on scroll to bottom', async () => {
      await renderVenue(venueId)

      fireEvent.scroll(screen.getByTestId('venue-container'), bottomScrollEvent)

      expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenVenueForSurvey)
    })

    it('should not trigger event on scroll to middle', async () => {
      await renderVenue(venueId)

      fireEvent.scroll(screen.getByTestId('venue-container'), middleScrollEvent)

      expect(BatchUser.trackEvent).not.toHaveBeenCalled()
    })

    it('should trigger event once on scroll to bottom and after 5 seconds', async () => {
      await renderVenue(venueId)

      fireEvent.scroll(screen.getByTestId('venue-container'), bottomScrollEvent)
      jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS)

      expect(BatchUser.trackEvent).toHaveBeenCalledTimes(1)
      expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenVenueForSurvey)
    })
  })
})

async function renderVenue(id: number, from?: Referrals) {
  useRoute.mockImplementation(() => ({ params: { id, from } }))
  const wrapper = render(<Venue />)
  await waitFor(() => wrapper)
  return wrapper
}
