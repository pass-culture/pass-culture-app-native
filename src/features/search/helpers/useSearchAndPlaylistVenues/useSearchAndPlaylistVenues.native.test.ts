import { SearchOfferHits } from 'features/search/api/useSearchResults/useSearchResults'
import { useSearchAndPlaylistVenues } from 'features/search/helpers/useSearchAndPlaylistVenues/useSearchAndPlaylistVenues'
import { Venue } from 'features/venue/types'
import { adaptAlgoliaVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/adaptAlgoliaVenues'
import { renderHook } from 'tests/utils'

const mockOfferVenues: Venue[] = [
  { venueId: 1, label: 'Venue 1', info: '' },
  { venueId: 2, label: 'Venue 2', info: '' },
]

const mockHitsWithVenues: SearchOfferHits = {
  offers: [],
  duplicatedOffers: [],
  venues: [
    {
      objectID: '1',
      city: '',
      postalCode: null,
      name: 'Venue 1',
      offerer_name: '',
      venue_type: null,
      description: '',
      audio_disability: null,
      mental_disability: null,
      motor_disability: null,
      visual_disability: null,
      email: null,
      phone_number: null,
      website: null,
      facebook: null,
      twitter: null,
      instagram: null,
      snapchat: null,
      banner_url: null,
      _geoloc: { lat: null, lng: null },
    },
    {
      objectID: '3',
      city: '',
      postalCode: null,
      name: 'Venue 3',
      offerer_name: '',
      venue_type: null,
      description: '',
      audio_disability: null,
      mental_disability: null,
      motor_disability: null,
      visual_disability: null,
      email: null,
      phone_number: null,
      website: null,
      facebook: null,
      twitter: null,
      instagram: null,
      snapchat: null,
      banner_url: null,
      _geoloc: { lat: null, lng: null },
    },
  ],
}

describe('useSearchAndPlaylistVenues', () => {
  it('should return only offerVenues if hits.venues is empty', () => {
    const { result } = renderHook(() =>
      useSearchAndPlaylistVenues({
        hits: { offers: [], duplicatedOffers: [], venues: [] },
        offerVenues: mockOfferVenues,
      })
    )

    expect(result.current).toEqual(mockOfferVenues)
  })

  it('should return merged venues without duplicates when both hits.venues and offerVenues are present', () => {
    const { result } = renderHook(() =>
      useSearchAndPlaylistVenues({
        hits: mockHitsWithVenues,
        offerVenues: mockOfferVenues,
      })
    )

    const expectedMergedVenues = [
      ...adaptAlgoliaVenues(mockHitsWithVenues.venues),
      { venueId: 2, label: 'Venue 2', info: '' },
    ]

    expect(result.current).toEqual(expectedMergedVenues)
  })

  it('should return only adapted playlist venues when offerVenues is empty', () => {
    const { result } = renderHook(() =>
      useSearchAndPlaylistVenues({
        hits: mockHitsWithVenues,
        offerVenues: [],
      })
    )

    const expectedVenues = adaptAlgoliaVenues(mockHitsWithVenues.venues)

    expect(result.current).toEqual(expectedVenues)
  })
})
