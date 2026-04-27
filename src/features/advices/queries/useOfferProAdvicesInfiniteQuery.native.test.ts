import { api } from 'api/api'
import { OfferProAdvices } from 'api/gen'
import { proAdvicesFixture } from 'features/advices/fixtures/offerProAdvices.fixture'
import {
  FIRST_PRO_ADVICES_PAGE,
  PRO_ADVICES_RESULTS_PER_PAGE,
} from 'features/advices/queries/proAdvicesPagination'
import { useOfferProAdvicesInfiniteQuery } from 'features/advices/queries/useOfferProAdvicesInfiniteQuery'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

const offerId = 1

const getOfferProAdvicesSpy = jest.spyOn(api, 'getNativeV1OfferofferIdAdvices')

describe('useOfferProAdvicesInfiniteQuery', () => {
  afterEach(() => {
    getOfferProAdvicesSpy.mockReset()
  })

  it('should fetch pro advices page by page', async () => {
    const firstPage: OfferProAdvices = {
      proAdvices: [proAdvicesFixture[0]],
      nbResults: 2,
    }
    const secondPage: OfferProAdvices = {
      proAdvices: [proAdvicesFixture[1]],
      nbResults: 2,
    }
    getOfferProAdvicesSpy.mockResolvedValueOnce(firstPage).mockResolvedValueOnce(secondPage)

    const { result } = renderHook(
      () =>
        useOfferProAdvicesInfiniteQuery({
          offerId,
          enableProAdvices: true,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => expect(result.current.data?.pages).toEqual([firstPage]))

    expect(getOfferProAdvicesSpy).toHaveBeenNthCalledWith(
      1,
      offerId,
      undefined,
      FIRST_PRO_ADVICES_PAGE,
      PRO_ADVICES_RESULTS_PER_PAGE,
      undefined,
      undefined
    )
    expect(result.current.hasNextPage).toBe(true)

    await act(async () => {
      await result.current.fetchNextPage()
    })

    await waitFor(() => expect(result.current.data?.pages).toEqual([firstPage, secondPage]))

    expect(getOfferProAdvicesSpy).toHaveBeenNthCalledWith(
      2,
      offerId,
      undefined,
      FIRST_PRO_ADVICES_PAGE + 1,
      PRO_ADVICES_RESULTS_PER_PAGE,
      undefined,
      undefined
    )
    expect(result.current.hasNextPage).toBe(false)
  })

  it('should not fetch when pro advices are disabled', async () => {
    const { result } = renderHook(
      () =>
        useOfferProAdvicesInfiniteQuery({
          offerId,
          enableProAdvices: false,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => expect(result.current.data).toBeUndefined())

    expect(getOfferProAdvicesSpy).not.toHaveBeenCalled()
  })
})
