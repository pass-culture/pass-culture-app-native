import { eventMonitoring } from 'libs/monitoring'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

import { useHomeRecommendedIdsMutation } from './useHomeRecommendedIdsMutation'

describe('useHomeRecommendedIdsMutation', () => {
  const mockFetch = jest.spyOn(global, 'fetch')

  beforeEach(() => {
    mockServer.universalPost('http://passculture.reco', {
      playlist_recommended_offers: [1234, 5678],
    })
  })

  it('should capture an exception when fetch call fails', async () => {
    mockFetch.mockRejectedValueOnce('some error')
    const { result } = renderHook(() => useHomeRecommendedIdsMutation(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    result.current.mutate({ endpointUrl: 'http://passculture.reco' })

    await waitFor(() => {
      expect(eventMonitoring.captureException).toHaveBeenCalledTimes(1)
    })
  })

  it('should return response body if fetch call succeeds', async () => {
    const body = { playlist_recommended_offers: ['102280', '102272', '102249', '102310'] }
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify(body), {
        headers: {
          'content-type': 'application/json',
        },
        status: 200,
      })
    )
    const { result } = renderHook(() => useHomeRecommendedIdsMutation(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    result.current.mutate({ endpointUrl: 'http://passculture.reco' })

    await act(async () => {})

    expect(result.current.data).toEqual(body)
  })
})
