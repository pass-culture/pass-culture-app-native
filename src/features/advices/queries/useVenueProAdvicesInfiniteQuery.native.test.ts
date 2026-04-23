import { api } from 'api/api'
import { VenueProAdvices } from 'api/gen'
import {
  FIRST_PRO_ADVICES_PAGE,
  PRO_ADVICES_RESULTS_PER_PAGE,
} from 'features/advices/queries/proAdvicesPagination'
import { useVenueProAdvicesInfiniteQuery } from 'features/advices/queries/useVenueProAdvicesInfiniteQuery'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { proAdvicesFixture } from 'features/venue/fixtures/venueProAdvices.fixture'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

const getVenueProAdvicesSpy = jest.spyOn(api, 'getNativeV1VenuevenueIdAdvices')

describe('useVenueProAdvicesInfiniteQuery', () => {
  afterEach(() => {
    getVenueProAdvicesSpy.mockReset()
  })

  it('should fetch pro advices page by page', async () => {
    const firstPage: VenueProAdvices = {
      proAdvices: [proAdvicesFixture[0]],
      nbResults: 2,
    }
    const secondPage: VenueProAdvices = {
      proAdvices: [proAdvicesFixture[1]],
      nbResults: 2,
    }
    getVenueProAdvicesSpy.mockResolvedValueOnce(firstPage).mockResolvedValueOnce(secondPage)

    const { result } = renderHook(
      () =>
        useVenueProAdvicesInfiniteQuery({
          venueId: venueDataTest.id,
          enableProAdvices: true,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => expect(result.current.data?.pages).toEqual([firstPage]))

    expect(getVenueProAdvicesSpy).toHaveBeenNthCalledWith(
      1,
      venueDataTest.id,
      undefined,
      FIRST_PRO_ADVICES_PAGE,
      PRO_ADVICES_RESULTS_PER_PAGE
    )
    expect(result.current.hasNextPage).toBe(true)

    await act(async () => {
      await result.current.fetchNextPage()
    })

    await waitFor(() => expect(result.current.data?.pages).toEqual([firstPage, secondPage]))

    expect(getVenueProAdvicesSpy).toHaveBeenNthCalledWith(
      2,
      venueDataTest.id,
      undefined,
      FIRST_PRO_ADVICES_PAGE + 1,
      PRO_ADVICES_RESULTS_PER_PAGE
    )
    expect(result.current.hasNextPage).toBe(false)
  })

  it('should not fetch when pro advices are disabled', async () => {
    const { result } = renderHook(
      () =>
        useVenueProAdvicesInfiniteQuery({
          venueId: venueDataTest.id,
          enableProAdvices: false,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => expect(result.current.data).toBeUndefined())

    expect(getVenueProAdvicesSpy).not.toHaveBeenCalled()
  })
})
