import { EventCardSubtitleEnum } from 'features/offer/components/MovieScreeningCalendar/enums'

import { getEventCardStatus } from './getEventCardStatus'

const defaultParams: Parameters<typeof getEventCardStatus>[0] = {
  features: ['VO'],
  isExternalBookingsDisabled: false,
  isScreeningSoldOut: false,
  hasBookedScreening: false,
  isSameVenue: false,
  isUserEligible: true,
}

describe('getEventCardStatus', () => {
  it('returns the screening features when the screening is available', () => {
    expect(getEventCardStatus(defaultParams)).toEqual({
      isDisabled: false,
      subtitleLeft: 'VO',
    })
  })

  it('prioritizes external booking unavailability', () => {
    expect(
      getEventCardStatus({
        ...defaultParams,
        isExternalBookingsDisabled: true,
        isScreeningSoldOut: true,
      })
    ).toEqual({
      isDisabled: true,
      subtitleLeft: EventCardSubtitleEnum.UNAVAILABLE,
    })
  })
})
