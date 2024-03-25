import { eventMonitoring } from 'libs/monitoring'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

import { useHomeRecommendedIdsQuery } from './useHomeRecommendedIdsQuery'

jest.mock('libs/monitoring')

describe('useHomeRecommendedIdsQuery', () => {
  const mockFetch = jest.spyOn(global, 'fetch')

  beforeEach(() => {
    mockServer.universalPost('http://passculture.reco', {
      playlist_recommended_offers: [1234, 5678],
    })
  })

  it('should not fetch recommendation api when no endpoint is provided', async () => {
    renderHook(() => useHomeRecommendedIdsQuery({ endpointUrl: undefined }), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(fetch).not.toHaveBeenCalled()
  })

  it('should capture an exception when fetch call fails', async () => {
    mockFetch.mockRejectedValueOnce('some error')
    renderHook(() => useHomeRecommendedIdsQuery({ endpointUrl: 'http://passculture.reco' }), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

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

    renderHook(() => useHomeRecommendedIdsQuery({ endpointUrl: 'http://passculture.reco' }), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

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
    renderHook(() => useHomeRecommendedIdsQuery({ endpointUrl: 'http://passculture.reco' }), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

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
    const { result } = renderHook(
      () => useHomeRecommendedIdsQuery({ endpointUrl: 'http://passculture.reco' }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await act(async () => {})

    expect(result.current.data).toEqual(body)
  })
})
