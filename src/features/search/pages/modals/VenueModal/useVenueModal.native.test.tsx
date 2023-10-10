import { Venue } from 'features/venue/types'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { act, renderHook } from 'tests/utils'

import useVenueModal from './useVenueModal'

const venue: Venue = mockedSuggestedVenues[0]

jest.useFakeTimers({ legacyFakeTimers: true })

describe('useVenueModal', () => {
  it('when start it should return falsy state', () => {
    const { result } = renderHook(useVenueModal)

    expect(result.current.isQueryProvided).toBeFalsy()
    expect(result.current.shouldShowSuggestedVenues).toBeFalsy()
    expect(result.current.isVenueNotSelected).toBeTruthy()
    expect(result.current.venueQuery.length).toBe(0)
  })
  it('when provide a query it should change state for the UI', async () => {
    const { result } = renderHook(useVenueModal)

    await act(async () => {
      result.current.doChangeVenue('toto')
    })

    expect(result.current.isQueryProvided).toBeTruthy()
    expect(result.current.shouldShowSuggestedVenues).toBeTruthy()
    expect(result.current.isVenueNotSelected).toBeTruthy()
    expect(result.current.venueQuery.length).toBe(4)
  })
  it('when select a venue it should change state for the UI', async () => {
    const { result } = renderHook(useVenueModal)

    await act(async () => {
      result.current.doChangeVenue(venue.label)
      result.current.doSetSelectedVenue(venue)
    })

    expect(result.current.isQueryProvided).toBeTruthy()
    expect(result.current.shouldShowSuggestedVenues).toBeFalsy()
    expect(result.current.isVenueNotSelected).toBeFalsy()
    expect(result.current.venueQuery.length).toBe(venue.label.length)
  })
})
