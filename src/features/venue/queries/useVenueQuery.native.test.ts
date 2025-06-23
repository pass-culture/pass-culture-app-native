import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { VenueResponse } from 'api/gen'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { VenueNotFound } from 'features/venue/pages/VenueNotFound/VenueNotFound'
import { LogTypeEnum, VenueNotFoundError } from 'libs/monitoring/errors'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

import { useVenueQuery } from './useVenueQuery'

jest.mock('libs/network/NetInfoWrapper')
jest.mock('libs/firebase/analytics/analytics')

const spyApiGetVenue = jest.spyOn(api, 'getNativeV1VenuevenueId')

describe('useVenueQuery', () => {
  it('should call API otherwise', async () => {
    mockServer.getApi<VenueResponse>(`/v1/venue/${venueDataTest.id}`, venueDataTest)
    const { result } = renderHook(() => useVenueQuery(venueDataTest.id), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await act(async () => {})

    expect(JSON.stringify(result.current.data)).toEqual(JSON.stringify(venueDataTest))
  })

  it('should trigger VenueNotFoundError when error is an ApiError and status code is 404', async () => {
    spyApiGetVenue.mockRejectedValueOnce(new ApiError(404, 'Venue not found'))
    const { result } = renderHook(() => useVenueQuery(venueDataTest.id), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await act(async () => {})

    expect(result.current.error).toEqual(
      new VenueNotFoundError(venueDataTest.id, {
        Screen: VenueNotFound,
        logType: LogTypeEnum.IGNORED,
      })
    )
  })

  it('should trigger ApiError when error is an ApiError and status code is 400', async () => {
    spyApiGetVenue.mockRejectedValueOnce(new ApiError(400, 'Bad request'))
    const { result } = renderHook(() => useVenueQuery(venueDataTest.id), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await act(async () => {})

    expect(result.current.error).toEqual(new ApiError(400, 'Bad request'))
  })
})
