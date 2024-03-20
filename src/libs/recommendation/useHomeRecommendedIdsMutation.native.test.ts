import { eventMonitoring } from 'libs/monitoring'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

import { useHomeRecommendedIdsMutation } from './useHomeRecommendedIdsMutation'

jest.mock('libs/monitoring')

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
      expect(eventMonitoring.logError).toHaveBeenCalledWith('Error with recommendation endpoint', {
        extra: { url: 'http://passculture.reco', stack: 'some error' },
      })
    })
  })

  it('should capture a message if response.ok is not true', async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(undefined, {
        headers: {
          'content-type': 'application/json',
        },
        status: 500,
      })
    )

    const { result } = renderHook(() => useHomeRecommendedIdsMutation(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    result.current.mutate({ endpointUrl: 'http://passculture.reco' })

    await act(async () => {})

    expect(eventMonitoring.logInfo).toHaveBeenCalledWith('Recommendation response was not ok', {
      extra: { url: 'http://passculture.reco', status: 500 },
    })
  })

  it('should capture a message when recommendation playlist is empty', async () => {
    const body = { playlist_recommended_offers: [] }
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

    await waitFor(() => {
      expect(eventMonitoring.logInfo).toHaveBeenCalledWith('Recommended offers playlist is empty', {
        extra: { url: 'http://passculture.reco', status: 200 },
      })
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
