import { PlaylistResponse } from 'api/gen'
import { EmptyResponse } from 'libs/fetch'
import { eventMonitoring } from 'libs/monitoring'
import { mockUseAuthContext } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

import { useHomeRecommendedIdsQuery } from './useHomeRecommendedIdsQuery'

jest.mock('libs/monitoring')
jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext')

describe('useHomeRecommendedIdsQuery', () => {
  it('should capture an exception when fetch call fails', async () => {
    mockServer.postApi<EmptyResponse>('/v1/recommendation/playlist', {
      responseOptions: { statusCode: 502, data: {} },
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
        'Error 502 with recommendation endpoint',
        { extra: { playlistRequestBody: '{}', playlistRequestQuery: '{}', statusCode: 502 } }
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

  it('should not make request if user is disconnected (and undefined in context)', async () => {
    mockServer.postApi<PlaylistResponse>('/v1/recommendation/playlist', {
      responseOptions: {
        statusCode: 200,
        data: {
          params: {},
          playlistRecommendedOffers: ['102280', '102272', '102249', '102310'],
        },
      },
    })
    mockUseAuthContext()

    const { result } = renderHook(
      () =>
        useHomeRecommendedIdsQuery({
          playlistRequestBody: {},
          playlistRequestQuery: {},
          userId: 1,
        }),
      {
        wrapper: (props) => reactQueryProviderHOC(props.children),
      }
    )
    await waitFor(() => {
      expect(result.current.isFetching).toEqual(false)
    })
  })
})
