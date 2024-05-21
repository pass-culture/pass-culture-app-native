import { PlaylistResponse } from 'api/gen'
import { eventMonitoring } from 'libs/monitoring'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

import { useHomeRecommendedIdsQuery } from './useHomeRecommendedIdsQuery'

jest.mock('libs/monitoring')

describe('useHomeRecommendedIdsQuery', () => {
  it('should capture an exception when fetch call fails', async () => {
    mockServer.postApi<PlaylistResponse>('/v1/recommendation/playlist', {
      responseOptions: { statusCode: 400 },
    })

    renderHook(
      () =>
        useHomeRecommendedIdsQuery({
          playlistRequestBody: {},
          playlistRequestQuery: {},
          userId: 1,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => {
      expect(eventMonitoring.captureException).toHaveBeenCalledWith(
        'Error with recommendation endpoint',
        { extra: { playlistRequestBody: '{}', playlistRequestQuery: '{}' } }
      )
    })
  })

  it('should capture an exception when recommendation playlist is empty', async () => {
    mockServer.postApi<PlaylistResponse>('/v1/recommendation/playlist', {
      responseOptions: { statusCode: 200, data: { params: {}, playlistRecommendedOffers: [] } },
    })
    renderHook(
      () =>
        useHomeRecommendedIdsQuery({
          playlistRequestBody: {},
          playlistRequestQuery: {},
          userId: 1,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => {
      expect(eventMonitoring.captureException).toHaveBeenCalledWith(
        'Recommended offers playlist is empty',
        { extra: { playlistRequestBody: '{}', playlistRequestQuery: '{}' }, level: 'info' }
      )
    })
  })

  it('should return playlist offer ids', async () => {
    mockServer.postApi<PlaylistResponse>('/v1/recommendation/playlist', {
      responseOptions: {
        statusCode: 200,
        data: {
          params: {},
          playlistRecommendedOffers: ['102280', '102272', '102249', '102310'],
        },
      },
    })
    const { result } = renderHook(
      () =>
        useHomeRecommendedIdsQuery({
          playlistRequestBody: {},
          playlistRequestQuery: {},
          userId: 1,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => {
      expect(result.current.data?.playlistRecommendedOffers).toEqual([
        '102280',
        '102272',
        '102249',
        '102310',
      ])
    })
  })
})
