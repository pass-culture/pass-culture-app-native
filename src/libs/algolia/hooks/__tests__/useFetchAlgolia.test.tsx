import { SearchResponse } from '@algolia/client-search'
import { renderHook, act, cleanup } from '@testing-library/react-hooks'
import React from 'react'
import { QueryCache, ReactQueryCacheProvider } from 'react-query'

import { AlgoliaParametersFields } from '../../../../features/home/contentful'
import { AlgoliaHit } from '../../algolia'
import { parseAlgoliaParameters } from '../../parseAlgoliaParameters'
import { ExtraAlgoliaParameters, FetchAlgoliaParameters } from '../../types'
import { useFetchAlgolia } from '../useFetchAlgolia'

const mockFetchAlgolia = jest.fn(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (_) => new Promise((res) => setTimeout(res({ hits: ['data'], nbHits: 10 }), 500))
)

jest.mock('libs/algolia/fetchAlgolia', () => ({
  fetchAlgolia: (arg: FetchAlgoliaParameters) => mockFetchAlgolia(arg),
}))

const mockOnSuccess = jest.fn()
const mockOnError = jest.fn()

const props: {
  algoliaParameters: AlgoliaParametersFields
  extraParameters?: Partial<ExtraAlgoliaParameters>
  onSuccess?: (data: SearchResponse<AlgoliaHit> | undefined) => void
  onError?: (error: unknown) => void
  queryKey: string
} = {
  algoliaParameters: { hitsPerPage: 10, title: 'param title' },
  extraParameters: { page: 0 },
  queryKey: 'queryKey',
  onSuccess: mockOnSuccess,
  onError: mockOnError,
}

describe('useFetchAlgolia', () => {
  afterEach(async () => {
    jest.clearAllMocks()
    await cleanup()
  })
  it('calls fetchAlgolia with params and returns data', async () => {
    const { result, waitForNextUpdate } = renderHook(
      (props: {
        algoliaParameters: AlgoliaParametersFields
        extraParameters?: Partial<ExtraAlgoliaParameters>
        onSuccess?: (data: SearchResponse<AlgoliaHit> | undefined) => void
        onError?: (error: unknown) => void
        queryKey: string
      }) => useFetchAlgolia({ ...props }),
      {
        initialProps: { ...props },
        // eslint-disable-next-line react/display-name
        wrapper: ({ children }) => {
          const queryCache = new QueryCache()
          return (
            <ReactQueryCacheProvider queryCache={queryCache}>{children}</ReactQueryCacheProvider>
          )
        },
      }
    )
    expect(mockFetchAlgolia).toHaveBeenCalledWith({
      ...parseAlgoliaParameters({ geolocation: null, parameters: props.algoliaParameters }),
      ...props.extraParameters,
    })

    await act(async () => {
      await waitForNextUpdate()
    })

    expect(result.current.data).toEqual({ hits: ['data'], nbHits: 10 })
    expect(result.current.hits).toEqual(['data'])
    expect(result.current.nbHits).toEqual(10)
  })
  it('calls onSuccess on success', async () => {
    const { waitForNextUpdate } = renderHook(
      (props: {
        algoliaParameters: AlgoliaParametersFields
        extraParameters?: Partial<ExtraAlgoliaParameters>
        onSuccess?: (data: SearchResponse<AlgoliaHit> | undefined) => void
        onError?: (error: unknown) => void
        queryKey: string
      }) => useFetchAlgolia({ ...props }),
      {
        initialProps: { ...props },
        // eslint-disable-next-line react/display-name
        wrapper: ({ children }) => {
          const queryCache = new QueryCache()
          return (
            <ReactQueryCacheProvider queryCache={queryCache}>{children}</ReactQueryCacheProvider>
          )
        },
      }
    )
    await act(async () => {
      await waitForNextUpdate()
    })

    expect(mockOnSuccess).toHaveBeenCalledWith({ hits: ['data'], nbHits: 10 })
    expect(mockOnError).not.toHaveBeenCalled()
  })
  it('calls onError on error', async () => {
    mockFetchAlgolia.mockImplementation(() => {
      return new Promise((_, rej) =>
        setTimeout(() => {
          rej(new Error('dummy-error'))
        }, 500)
      )
    })

    const { waitForNextUpdate, result, waitFor } = renderHook(
      (props: {
        algoliaParameters: AlgoliaParametersFields
        extraParameters?: Partial<ExtraAlgoliaParameters>
        onSuccess?: (data: SearchResponse<AlgoliaHit> | undefined) => void
        onError?: (error: unknown) => void
        queryKey: string
      }) => useFetchAlgolia({ ...props }),
      {
        initialProps: { ...props },
        // eslint-disable-next-line react/display-name
        wrapper: ({ children }) => {
          const queryCache = new QueryCache()
          return (
            <ReactQueryCacheProvider queryCache={queryCache}>{children}</ReactQueryCacheProvider>
          )
        },
      }
    )
    await act(async () => {
      await waitForNextUpdate()
    })
    await waitFor(() => {
      return !result.current.isLoading
    })

    expect(mockOnSuccess).not.toHaveBeenCalled()
    expect(result.current.error).toEqual(new Error('dummy-error'))
    expect(mockOnError).toHaveBeenCalledWith(new Error('dummy-error'))
  })
})
