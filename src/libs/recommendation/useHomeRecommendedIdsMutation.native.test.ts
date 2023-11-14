/* eslint-disable local-rules/no-react-query-provider-hoc */

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
      expect(eventMonitoring.captureException).toHaveBeenCalledWith(
        'Error with recommendation endpoint',
        {
          extra: { url: 'http://passculture.reco', stack: 'some error' },
        }
      )
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

    expect(eventMonitoring.captureMessage).toHaveBeenCalledWith(
      'Recommendation response was not ok',
      {
        level: 'info',
        extra: { url: 'http://passculture.reco', status: 500 },
      }
    )
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
      expect(eventMonitoring.captureMessage).toHaveBeenCalledWith(
        'Recommended offers playlist is empty',
        {
          level: 'info',
          extra: { url: 'http://passculture.reco', status: 200 },
        }
      )
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
