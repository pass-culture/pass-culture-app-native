import { VenueOffersResponseSnap } from 'features/venue/fixtures/venueOffersResponseSnap'

export const useVenueOffers = jest
  .fn()
  .mockReturnValue({ data: { hits: VenueOffersResponseSnap, nbHits: 4 } })
