import { VenueResponse } from 'api/gen'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'

export const venueWithOpeningHours: VenueResponse = {
  ...venueResponseSnap,
  openingHours: {
    MONDAY: [{ open: '09:00', close: '19:00' }],
    TUESDAY: [
      { open: '09:00', close: '12:00' },
      { open: '14:00', close: '19:00' },
    ],
    WEDNESDAY: [
      { open: '09:00', close: '12:00' },
      { open: '14:00', close: '19:00' },
    ],
    THURSDAY: [
      { open: '09:00', close: '12:00' },
      { open: '14:00', close: '19:00' },
    ],
    FRIDAY: [{ open: '09:00', close: '19:00' }],
    SATURDAY: undefined,
    SUNDAY: undefined,
  },
}
