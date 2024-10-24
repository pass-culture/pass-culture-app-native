import { addDays } from 'date-fns'
import mockdate from 'mockdate'

import { moviesOfferBuilder } from './moviesOffer.builder'
import { offerResponseBuilder, stockBuilder } from './offersStockResponse.builder'

describe('moviesOfferBuilder', () => {
  const now = new Date('2023-05-01T12:00:00Z')
  const selectedDate = new Date('2023-05-02T12:00:00Z')
  const location = { latitude: 48.8566, longitude: 2.3522 }

  mockdate.set(now)

  describe('withMoviesOnDay', () => {
    it('should keep only movies on the selected day', () => {
      const offer1 = offerResponseBuilder()
        .withStocks([stockBuilder().withBeginningDatetime(selectedDate.toString()).build()])
        .build()
      const offer2 = offerResponseBuilder()
        .withStocks([
          stockBuilder().withBeginningDatetime(addDays(selectedDate, 1).toString()).build(),
        ])
        .build()

      const result = moviesOfferBuilder([offer1, offer2])
        .withMoviesOnDay(selectedDate)
        .buildOfferResponse()

      expect(result).toHaveLength(1)
      expect(result[0]?.id).toBe(offer1.id)
    })
  })

  describe('sortedByLast30DaysBooking', () => {
    it('should sort offers by last 30 days bookings', () => {
      const offer1 = offerResponseBuilder().withLast30DaysBookings(10).build()
      const offer2 = offerResponseBuilder().withLast30DaysBookings(20).build()
      const offer3 = offerResponseBuilder().withLast30DaysBookings(15).build()

      const result = moviesOfferBuilder([offer1, offer2, offer3])
        .sortedByLast30DaysBooking()
        .buildOfferResponse()

      expect(result.map((o) => o.id)).toEqual([offer2.id, offer3.id, offer1.id])
    })
  })

  describe('sortedByDistance', () => {
    it('should sort offers by distance from given location', () => {
      const offer1 = offerResponseBuilder()
        .withVenue({
          id: 1,
          isPermanent: true,
          name: 'Venue 1',
          offerer: { name: 'Offerer 1' },
          timezone: 'Europe/Paris',
          coordinates: { latitude: 48.8584, longitude: 2.2945 },
        })
        .build()
      const offer2 = offerResponseBuilder()
        .withVenue({
          id: 2,
          isPermanent: true,
          name: 'Venue 2',
          offerer: { name: 'Offerer 2' },
          timezone: 'Europe/Paris',
          coordinates: { latitude: 48.8566, longitude: 2.3522 },
        })
        .build()
      const offer3 = offerResponseBuilder()
        .withVenue({
          id: 3,
          isPermanent: true,
          name: 'Venue 3',
          offerer: { name: 'Offerer 3' },
          timezone: 'Europe/Paris',
          coordinates: { latitude: 48.8738, longitude: 2.295 },
        })
        .build()

      const result = moviesOfferBuilder([offer1, offer2, offer3])
        .sortedByDistance(location)
        .buildOfferResponse()

      expect(result.map((o) => o.id)).toEqual([offer2.id, offer1.id, offer3.id])
    })

    it('should handle offers without venue coordinates', () => {
      const offer1 = offerResponseBuilder()
        .withVenue({
          id: 1,
          isPermanent: true,
          name: 'Venue 1',
          offerer: { name: 'Offerer 1' },
          timezone: 'Europe/Paris',
          coordinates: { latitude: 48.8584, longitude: 2.2945 },
        })
        .build()
      const offer2 = offerResponseBuilder()
        .withVenue({
          id: 2,
          isPermanent: true,
          name: 'Venue 2',
          offerer: { name: 'Offerer 2' },
          timezone: 'Europe/Paris',
          coordinates: { latitude: null, longitude: null },
        })
        .build()
      const offer3 = offerResponseBuilder()
        .withVenue({
          id: 3,
          isPermanent: true,
          name: 'Venue 3',
          offerer: { name: 'Offerer 3' },
          timezone: 'Europe/Paris',
          coordinates: { latitude: 48.8738, longitude: 2.295 },
        })
        .build()

      const result = moviesOfferBuilder([offer1, offer2, offer3])
        .sortedByDistance(location)
        .buildOfferResponse()

      expect(result.map((o) => o.id)).toEqual([offer1.id, offer3.id, offer2.id])
    })
  })

  describe('withoutMoviesAfter15Days', () => {
    it('should filter out movies after 15 days', () => {
      const offer1 = offerResponseBuilder()
        .withId(1)
        .withStocks([stockBuilder().withBeginningDatetime(addDays(now, 10).toString()).build()])
        .build()
      const offer2 = offerResponseBuilder()
        .withId(2)
        .withStocks([stockBuilder().withBeginningDatetime(addDays(now, 20).toString()).build()])
        .build()

      const result = moviesOfferBuilder([offer1, offer2])
        .withoutMoviesAfter15Days()
        .buildOfferResponse()

      expect(result).toHaveLength(1)
      expect(result[0]?.id).toBe(offer1.id)
    })
  })

  describe('withMoviesAfter15Days', () => {
    it('should only return movies after 15 days', () => {
      const offer1 = offerResponseBuilder()
        .withId(1)
        .withStocks([stockBuilder().withBeginningDatetime(now.toString()).build()])
        .build()
      const offer2 = offerResponseBuilder()
        .withId(2)
        .withStocks([stockBuilder().withBeginningDatetime(addDays(now, 20).toString()).build()])
        .build()

      const result = moviesOfferBuilder([offer1, offer2])
        .withMoviesAfter15Days()
        .buildOfferResponse()

      expect(result).toHaveLength(1)
      expect(result[0]?.id).toBe(offer2.id)
    })
  })

  describe('withNextScreeningFromDate', () => {
    it('should set the next screening date for each offer', () => {
      const offer1 = offerResponseBuilder()
        .withStocks([
          stockBuilder().withBeginningDatetime(addDays(selectedDate, 1).toString()).build(),
        ])
        .build()
      const offer2 = offerResponseBuilder()
        .withStocks([
          stockBuilder().withBeginningDatetime(addDays(selectedDate, 2).toString()).build(),
        ])
        .build()

      const result = moviesOfferBuilder([offer1, offer2])
        .withNextScreeningFromDate(selectedDate)
        .build()

      expect(result).toHaveLength(2)
      expect(result[0]?.nextDate).toEqual(addDays(selectedDate, 1))
      expect(result[1]?.nextDate).toEqual(addDays(selectedDate, 2))
    })
  })

  describe('buildOfferResponse', () => {
    it('should return an array of OfferResponseV2', () => {
      const offer1 = offerResponseBuilder().build()
      const offer2 = offerResponseBuilder().build()

      const result = moviesOfferBuilder([offer1, offer2]).buildOfferResponse()

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual(offer1)
      expect(result[1]).toEqual(offer2)
    })
  })
})
