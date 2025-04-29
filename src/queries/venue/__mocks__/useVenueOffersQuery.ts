import { VenueOffersResponseSnap } from 'features/venue/fixtures/venueOffersResponseSnap'

export const useVenueOffersQuery = jest
  .fn()
  .mockReturnValue({ data: { hits: VenueOffersResponseSnap, nbHits: 4 } })
