import mockdate from 'mockdate'

import { OffersStocksResponseV2 } from 'api/gen'
import { mockBuilder } from 'tests/mockBuilder'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook } from 'tests/utils'

import { getVenueMovieOffers } from './getVenueMovieOffers'

const TODAY = new Date('2023-05-10')
const BEFORE_SELECTED_DATE = '2023-05-07T00:00:00.000Z'
const SELECTED_DATE = '2023-05-15T00:00:00.000Z'
const AFTER_SELECTED_DATE = '2023-05-20T00:00:00.000Z'
const AT_LEAST_15_DAYS_AFTER_SELECTED_DATE = '2023-06-20T00:00:00.000Z'
const SELECTED_DATE_PLUS_1_SECOND = '2023-05-15T00:00:01.000Z'
const SELECTED_DATE_PLUS_2_SECOND = '2023-05-15T00:00:02.000Z'
const SELECTED_DATE_PLUS_3_SECOND = '2023-05-15T00:00:03.000Z'

describe('useVenueMovieOffers', () => {
  beforeEach(() => {
    mockdate.set(TODAY)
  })

  it('should sort offers by descending last30DaysBooking order', async () => {
    const offers = {
      offers: [
        mockBuilder.offerResponseV2({
          id: 1,
          last30DaysBookings: 400,
          stocks: [
            mockBuilder.offerStockResponse({ beginningDatetime: SELECTED_DATE_PLUS_1_SECOND }),
          ],
        }),
        mockBuilder.offerResponseV2({
          id: 2,
          last30DaysBookings: 200,
          stocks: [
            mockBuilder.offerStockResponse({ beginningDatetime: SELECTED_DATE_PLUS_2_SECOND }),
          ],
        }),
        mockBuilder.offerResponseV2({
          id: 3,
          last30DaysBookings: 300,
          stocks: [
            mockBuilder.offerStockResponse({ beginningDatetime: SELECTED_DATE_PLUS_3_SECOND }),
          ],
        }),
      ],
    }
    const { result } = renderUseVenueMovieOffers(new Date(SELECTED_DATE), offers)

    expect(result.current.venueMovieOffers).toEqual([
      expect.objectContaining({
        offer: expect.objectContaining({ last30DaysBookings: 400 }),
      }),
      expect.objectContaining({
        offer: expect.objectContaining({ last30DaysBookings: 300 }),
      }),
      expect.objectContaining({
        offer: expect.objectContaining({ last30DaysBookings: 200 }),
      }),
    ])
  })

  it('should return movie offers of the selected date', async () => {
    const offers = {
      offers: [
        mockBuilder.offerResponseV2({
          id: 1,
          stocks: [
            mockBuilder.offerStockResponse({ beginningDatetime: SELECTED_DATE_PLUS_1_SECOND }),
          ],
        }),
        mockBuilder.offerResponseV2({
          id: 2,
          stocks: [mockBuilder.offerStockResponse({ beginningDatetime: BEFORE_SELECTED_DATE })],
        }),
      ],
    }

    const { result } = renderUseVenueMovieOffers(new Date(SELECTED_DATE), offers)

    expect(result.current.venueMovieOffers).toHaveLength(1)
    expect(result.current.venueMovieOffers[0]?.offer.id).toBe(1)
  })

  it('should return next movie offers of a given date', async () => {
    const offers = {
      offers: [
        mockBuilder.offerResponseV2({
          id: 1,
          stocks: [
            mockBuilder.offerStockResponse({
              beginningDatetime: AFTER_SELECTED_DATE,
            }),
          ],
        }),
        mockBuilder.offerResponseV2({
          id: 2,
          stocks: [mockBuilder.offerStockResponse({ beginningDatetime: BEFORE_SELECTED_DATE })],
        }),
      ],
    }

    const { result } = renderUseVenueMovieOffers(new Date(SELECTED_DATE), offers)

    expect(result.current.venueMovieOffers).toHaveLength(1)
    expect(result.current.venueMovieOffers[0]?.offer.id).toBe(1)
  })

  it('should return empty array when there are no movies on a given day or after', async () => {
    const offers = {
      offers: [
        mockBuilder.offerResponseV2({
          id: 1,
          stocks: [mockBuilder.offerStockResponse({ beginningDatetime: BEFORE_SELECTED_DATE })],
        }),
      ],
    }

    const { result } = renderUseVenueMovieOffers(new Date(SELECTED_DATE), offers)

    expect(result.current.venueMovieOffers).toHaveLength(0)
  })

  it('should not return movies with screenings after 15 days when other movies have screenings within 15 days', async () => {
    const offers = {
      offers: [
        mockBuilder.offerResponseV2({
          id: 1,
          stocks: [
            mockBuilder.offerStockResponse({
              beginningDatetime: SELECTED_DATE_PLUS_1_SECOND,
            }),
          ],
        }),
        mockBuilder.offerResponseV2({
          id: 2,
          stocks: [
            mockBuilder.offerStockResponse({
              beginningDatetime: AT_LEAST_15_DAYS_AFTER_SELECTED_DATE,
            }),
          ],
        }),
      ],
    }

    const { result } = renderUseVenueMovieOffers(new Date(SELECTED_DATE), offers)

    expect(result.current.venueMovieOffers).toHaveLength(1)
    expect(result.current.venueMovieOffers[0]?.offer.id).toBe(1)
  })

  it("should only return movie with screenings after 15 days when other movies don't have screenings within 15 days", async () => {
    const offers = {
      offers: [
        mockBuilder.offerResponseV2({
          id: 1,
          stocks: [
            mockBuilder.offerStockResponse({
              beginningDatetime: BEFORE_SELECTED_DATE,
            }),
          ],
        }),
        mockBuilder.offerResponseV2({
          id: 2,
          stocks: [
            mockBuilder.offerStockResponse({
              beginningDatetime: AT_LEAST_15_DAYS_AFTER_SELECTED_DATE,
            }),
          ],
        }),
      ],
    }

    const { result } = renderUseVenueMovieOffers(new Date(SELECTED_DATE), offers)

    expect(result.current.venueMovieOffers).toHaveLength(1)
    expect(result.current.venueMovieOffers[0]?.offer.id).toBe(2)
  })
})

const renderUseVenueMovieOffers = (selectedDate: Date, offers: OffersStocksResponseV2) =>
  renderHook(() => getVenueMovieOffers(selectedDate, offers), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
