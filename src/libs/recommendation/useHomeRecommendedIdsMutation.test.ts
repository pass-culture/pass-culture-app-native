/* eslint-disable local-rules/no-react-query-provider-hoc */
import * as reactQueryAPI from 'react-query'

import { analytics } from 'libs/firebase/analytics'
import { eventMonitoring } from 'libs/monitoring'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

import { useHomeRecommendedIdsMutation } from './useHomeRecommendedIdsMutation'

describe('useHomeRecommendedIdsMutation', () => {
  const mockFetch = jest.spyOn(global, 'fetch')
  const mockUseMutation = jest.spyOn(reactQueryAPI, 'useMutation')

  it('should call useMutation', () => {
    renderHook(() => useHomeRecommendedIdsMutation(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(mockUseMutation).toHaveBeenCalledTimes(1)
  })

  it('should call fetch when mutate', async () => {
    const { result } = renderHook(() => useHomeRecommendedIdsMutation(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    result.current.mutate({ endpointUrl: 'http://passculture.reco' })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('http://passculture.reco', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({}),
      })
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
    await waitFor(() => {
      expect(result.current.data).toEqual(body)
    })
  })

  it('should log response body parameters on firebase when fetch call succeeds', async () => {
    const params = {
      reco_origin: 'cold_start',
      model_name: 'awesome_model',
      model_version: 'awesome_model_V202201010001',
      geo_located: true,
      ab_test: 'A',
      filtered: true,
    }
    const body = { playlist_recommended_offers: ['102280', '102272', '102249', '102310'], params }
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
      expect(analytics.setDefaultEventParameters).toHaveBeenCalledWith(params)
    })
  })
})
