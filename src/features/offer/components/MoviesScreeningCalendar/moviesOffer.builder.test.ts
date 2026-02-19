import { addDays, addSeconds } from 'date-fns'
import mockdate from 'mockdate'

import { mockBuilder } from 'tests/mockBuilder'

import { moviesOfferBuilder } from './moviesOffer.builder'

describe('moviesOfferBuilder', () => {
  const now = new Date('2023-05-01T12:00:00Z')
  const selectedDate = new Date('2023-05-02T12:00:00Z')
  const location = { latitude: 48.8566, longitude: 2.3522 }

  mockdate.set(now)

  describe('withMoviesOnDay', () => {
    it('should keep only movies on the selected day', () => {
      const offer1 = mockBuilder.offerResponseV2({
        stocks: [mockBuilder.offerStockResponse({ beginningDatetime: selectedDate.toString() })],
      })
      const offer2 = mockBuilder.offerResponseV2({
        stocks: [
          mockBuilder.offerStockResponse({
            beginningDatetime: addDays(selectedDate, 1).toString(),
          }),
        ],
      })

      const result = moviesOfferBuilder([offer1, offer2])
        .withScreeningsOnDay(selectedDate)
        .buildOfferResponse()

      expect(result).toHaveLength(1)
      expect(result[0]?.id).toBe(offer1.id)
    })
  })

  describe('withoutMoviesOnDay', () => {
    it('should not return movies of the selected day', () => {
      const selectedDatePlus1Second = addSeconds(selectedDate, 1)
      const offer1 = mockBuilder.offerResponseV2({
        stocks: [
          mockBuilder.offerStockResponse({ beginningDatetime: selectedDatePlus1Second.toString() }),
        ],
      })
      const offer2 = mockBuilder.offerResponseV2({
        stocks: [
          mockBuilder.offerStockResponse({
            beginningDatetime: addDays(selectedDate, 1).toString(),
          }),
        ],
      })

      const result = moviesOfferBuilder([offer1, offer2])
        .withoutScreeningsOnDay(selectedDate)
        .buildOfferResponse()

      expect(result).toHaveLength(1)
      expect(result[0]?.id).toBe(offer2.id)
    })
  })

  describe('sortedByLast30DaysBooking', () => {
    it('should sort offers by last 30 days bookings', () => {
      const offer1 = mockBuilder.offerResponseV2({ last30DaysBookings: 10 })
      const offer2 = mockBuilder.offerResponseV2({ last30DaysBookings: 20 })
      const offer3 = mockBuilder.offerResponseV2({ last30DaysBookings: 15 })

      const result = moviesOfferBuilder([offer1, offer2, offer3])
        .sortedByLast30DaysBooking()
        .buildOfferResponse()

      expect(result.map((o) => o.id)).toEqual([offer2.id, offer3.id, offer1.id])
    })
  })

  describe('sortedByDistance', () => {
    it('should sort offers by distance from given location', () => {
      const offer1 = mockBuilder.offerResponseV2({
        venue: {
          id: 1,
          isPermanent: true,
          name: 'Venue 1',
          offerer: { name: 'Offerer 1' },
          timezone: 'Europe/Paris',
          coordinates: { latitude: 48.8584, longitude: 2.2945 },
        },
      })
      const offer2 = mockBuilder.offerResponseV2({
        venue: {
          id: 2,
          isPermanent: true,
          name: 'Venue 2',
          offerer: { name: 'Offerer 2' },
          timezone: 'Europe/Paris',
          coordinates: { latitude: 48.8566, longitude: 2.3522 },
        },
      })
      const offer3 = mockBuilder.offerResponseV2({
        venue: {
          id: 3,
          isPermanent: true,
          name: 'Venue 3',
          offerer: { name: 'Offerer 3' },
          timezone: 'Europe/Paris',
          coordinates: { latitude: 48.8738, longitude: 2.295 },
        },
      })

      const result = moviesOfferBuilder([offer1, offer2, offer3])
        .sortedByDistance(location)
        .buildOfferResponse()

      expect(result.map((o) => o.id)).toEqual([offer2.id, offer1.id, offer3.id])
    })

    it('should handle offers without venue coordinates', () => {
      const offer1 = mockBuilder.offerResponseV2({
        venue: {
          id: 1,
          isPermanent: true,
          name: 'Venue 1',
          offerer: { name: 'Offerer 1' },
          timezone: 'Europe/Paris',
          coordinates: { latitude: 48.8584, longitude: 2.2945 },
        },
      })
      const offer2 = mockBuilder.offerResponseV2({
        venue: {
          id: 2,
          isPermanent: true,
          name: 'Venue 2',
          offerer: { name: 'Offerer 2' },
          timezone: 'Europe/Paris',
          coordinates: { latitude: null, longitude: null },
        },
      })
      const offer3 = mockBuilder.offerResponseV2({
        venue: {
          id: 3,
          isPermanent: true,
          name: 'Venue 3',
          offerer: { name: 'Offerer 3' },
          timezone: 'Europe/Paris',
          coordinates: { latitude: 48.8738, longitude: 2.295 },
        },
      })

      const result = moviesOfferBuilder([offer1, offer2, offer3])
        .sortedByDistance(location)
        .buildOfferResponse()

      expect(result.map((o) => o.id)).toEqual([offer1.id, offer3.id, offer2.id])
    })
  })

  describe('sortedByDate', () => {
    it('should sort offers by earliest next date', () => {
      const offer1 = mockBuilder.offerResponseV2({
        stocks: [
          mockBuilder.offerStockResponse({
            beginningDatetime: addDays(selectedDate, 3).toString(),
          }),
        ],
      })
      const offer2 = mockBuilder.offerResponseV2({
        stocks: [
          mockBuilder.offerStockResponse({
            beginningDatetime: addDays(selectedDate, 4).toString(),
          }),
        ],
      })
      const offer3 = mockBuilder.offerResponseV2({
        stocks: [
          mockBuilder.offerStockResponse({
            beginningDatetime: addDays(selectedDate, 2).toString(),
          }),
        ],
      })

      const result = moviesOfferBuilder([offer1, offer2, offer3])
        .sortedByDate()
        .buildOfferResponse()

      expect(result.map((o) => o.id)).toEqual([offer3.id, offer1.id, offer2.id])
    })
  })

  describe('withoutMoviesAfterNbDays', () => {
    it('should filter out movies within the specified range of days', () => {
      const offer1 = mockBuilder.offerResponseV2({
        id: 1,
        stocks: [
          mockBuilder.offerStockResponse({
            beginningDatetime: addDays(now, 5).toString(),
          }),
        ],
      })
      const offer2 = mockBuilder.offerResponseV2({
        id: 2,
        stocks: [
          mockBuilder.offerStockResponse({
            beginningDatetime: addDays(now, 10).toString(),
          }),
        ],
      })
      const offer3 = mockBuilder.offerResponseV2({
        id: 3,
        stocks: [
          mockBuilder.offerStockResponse({
            beginningDatetime: addDays(now, 20).toString(),
          }),
        ],
      })

      const result = moviesOfferBuilder([offer1, offer2, offer3])
        .withoutScreeningsAfterNbDays(15)
        .buildOfferResponse()

      expect(result).toHaveLength(2)
    })
  })

  describe('withNextScreeningFromDate', () => {
    it('should set the next screening date for each offer', () => {
      const offer1 = mockBuilder.offerResponseV2({
        stocks: [
          mockBuilder.offerStockResponse({
            beginningDatetime: addDays(selectedDate, 1).toString(),
          }),
        ],
      })
      const offer2 = mockBuilder.offerResponseV2({
        stocks: [
          mockBuilder.offerStockResponse({
            beginningDatetime: addDays(selectedDate, 2).toString(),
          }),
        ],
      })

      const result = moviesOfferBuilder([offer1, offer2])
        .withNextScreeningFromDate(selectedDate)
        .build()

      expect(result).toHaveLength(2)
      expect(result[0]?.nextDate).toEqual(addDays(selectedDate, 1))
      expect(result[1]?.nextDate).toEqual(addDays(selectedDate, 2))
    })
  })

  describe('withMoviesAfterNbDays', () => {
    it('should only return movies after the specified number of days from now', () => {
      const offer1 = mockBuilder.offerResponseV2({
        id: 1,
        stocks: [{ beginningDatetime: addDays(now, 5).toString() }],
      })
      const offer2 = mockBuilder.offerResponseV2({
        id: 2,
        stocks: [{ beginningDatetime: addDays(now, 10).toString() }],
      })
      const offer3 = mockBuilder.offerResponseV2({
        id: 3,
        stocks: [{ beginningDatetime: addDays(now, 20).toString() }],
      })

      const result = moviesOfferBuilder([offer1, offer2, offer3])
        .withScreeningsAfterNbDays(15)
        .buildOfferResponse()

      expect(result).toHaveLength(1)
      expect(result[0]?.id).toBe(offer3.id)
    })
  })

  describe('buildOfferResponse', () => {
    it('should return an array of OfferResponse', () => {
      const offer1 = mockBuilder.offerResponseV2({})
      const offer2 = mockBuilder.offerResponseV2({})

      const result = moviesOfferBuilder([offer1, offer2]).buildOfferResponse()

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual(offer1)
      expect(result[1]).toEqual(offer2)
    })
  })
})
