import { renderHook } from '@testing-library/react-hooks'
import * as reactQueryAPI from 'react-query'

import { eventMonitoring } from 'libs/monitoring'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { useHomeRecommendedIdsMutation } from '../useHomeRecommendedIdsMutation'

describe('useHomeRecommendedIdsMutation', () => {
  const mockFetch = jest.spyOn(global, 'fetch')
  const mockUseMutation = jest.spyOn(reactQueryAPI, 'useMutation')

  it('should call useMutation', () => {
    renderHook(() => useHomeRecommendedIdsMutation('http://passculture.reco'), {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(mockUseMutation).toHaveBeenCalled()
  })

  it('should call fetch when mutate', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useHomeRecommendedIdsMutation('http://passculture.reco'),
      {
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )
    result.current.mutate({})
    await waitForNextUpdate()
    expect(mockFetch).toHaveBeenCalledWith('http://passculture.reco', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({}),
    })
  })

  it('should capture an exception when fetch call fails', async () => {
    mockFetch.mockRejectedValueOnce('some error')
    const { result, waitForNextUpdate } = renderHook(
      () => useHomeRecommendedIdsMutation('http://passculture.reco'),
      {
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )
    result.current.mutate({})
    await waitForNextUpdate()
    expect(eventMonitoring.captureException).toHaveBeenCalled()
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
    const { result, waitForNextUpdate } = renderHook(
      () => useHomeRecommendedIdsMutation('http://passculture.reco'),
      {
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )
    result.current.mutate({})
    await waitForNextUpdate()
    expect(result.current.data).toEqual(body)
  })
})
