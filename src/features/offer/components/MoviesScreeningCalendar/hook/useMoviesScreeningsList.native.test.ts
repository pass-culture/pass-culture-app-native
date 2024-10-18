import { SubcategoryIdEnum } from 'api/gen'
import * as getStocksByOfferIdsModule from 'features/offer/api/getStocksByOfferIds'
import * as useMovieCalendarModule from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import {
  offerResponseBuilder,
  stockBuilder,
} from 'features/offer/components/MoviesScreeningCalendar/offersStockResponse.builder'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

import { useMoviesScreeningsList } from './useMoviesScreeningsList'

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
jest.mock('libs/network/NetInfoWrapper')

const getStocksByOfferIdsModuleSpy = jest.spyOn(getStocksByOfferIdsModule, 'getStocksByOfferIds')

describe('useMoviesScreeningsList', () => {
  const mockSelectedDate = new Date('2023-05-15')
  const mockOfferIds = [1, 2, 3]

  beforeEach(() => {
    jest
      .spyOn(useMovieCalendarModule, 'useMovieCalendar')
      .mockReturnValue({ selectedDate: mockSelectedDate, goToDate: jest.fn })
  })

  it('should return filtered movie offers', async () => {
    const mockOffers = [
      offerResponseBuilder()
        .withId(1)
        .withSubcategoryId(SubcategoryIdEnum.SEANCE_CINE)
        .withStocks([stockBuilder().withBeginningDatetime('2023-05-15T10:00:00Z').build()])
        .build(),
      offerResponseBuilder()
        .withId(2)
        .withSubcategoryId(SubcategoryIdEnum.SEANCE_CINE)
        .withStocks([stockBuilder().withBeginningDatetime('2023-05-16T10:00:00Z').build()])
        .build(),
      offerResponseBuilder()
        .withId(3)
        .withSubcategoryId(SubcategoryIdEnum.LIVRE_PAPIER)
        .withStocks([stockBuilder().withBeginningDatetime('2023-05-15T10:00:00Z').build()])
        .build(),
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
