import { SubcategoryIdEnum } from 'api/gen'
import * as getStocksByOfferIdsModule from 'features/offer/api/getStocksByOfferIds'
import * as useMovieCalendarModule from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { mockBuilder } from 'tests/mockBuilder'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

import { useMoviesScreeningsList } from './useMoviesScreeningsList'

jest.mock('libs/network/NetInfoWrapper')

const getStocksByOfferIdsModuleSpy = jest.spyOn(getStocksByOfferIdsModule, 'getStocksByOfferIds')

describe('useMoviesScreeningsList', () => {
  const mockSelectedDate = new Date('2023-05-15')
  const mockOfferIds = [1, 2, 3]

  beforeEach(() => {
    jest.spyOn(useMovieCalendarModule, 'useMovieCalendar').mockReturnValue({
      selectedDate: mockSelectedDate,
      goToDate: jest.fn(),
      displayCalendar: jest.fn(),
    })
  })

  it('should return filtered movie offers', async () => {
    const mockOffers = [
      mockBuilder.offerResponseV2({
        id: 1,
        subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
        stocks: [
          mockBuilder.offerStockResponse({
            beginningDatetime: '2023-05-15T10:00:00Z',
          }),
        ],
      }),
      mockBuilder.offerResponseV2({
        id: 2,
        subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
        stocks: [
          mockBuilder.offerStockResponse({
            beginningDatetime: '2023-05-16T10:00:00Z',
          }),
        ],
      }),
      mockBuilder.offerResponseV2({
        id: 3,
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
        stocks: [
          mockBuilder.offerStockResponse({
            beginningDatetime: '2023-05-15T10:00:00Z',
          }),
        ],
      }),
    ]

    getStocksByOfferIdsModuleSpy.mockResolvedValueOnce({ offers: mockOffers })

    const { result } = renderHook(() => useMoviesScreeningsList(mockOfferIds), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await act(async () => {})

    expect(result.current.moviesOffers).toStrictEqual([{ isUpcoming: false, offer: mockOffers[0] }])
  })

  it('should return an empty array when no offers match the criteria', async () => {
    getStocksByOfferIdsModuleSpy.mockResolvedValueOnce({ offers: [] })

    const { result } = renderHook(() => useMoviesScreeningsList(mockOfferIds), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await act(async () => {})

    expect(result.current.moviesOffers).toHaveLength(0)
  })
})
