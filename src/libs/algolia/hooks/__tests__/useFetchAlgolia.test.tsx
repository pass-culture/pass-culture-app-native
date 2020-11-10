import { renderHook, act, cleanup } from '@testing-library/react-hooks'

import { useFetchAlgolia } from 'libs/algolia'
import { parseAlgoliaParameters } from 'libs/algolia/parseAlgoliaParameters'
import { FetchAlgoliaParameters } from 'libs/algolia/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { UseFetchAlgoliaInterface } from '../useFetchAlgolia'

const mockFetchAlgolia = jest.fn().mockResolvedValue({ hits: ['data'], nbHits: 10 })

jest.mock('libs/algolia/fetchAlgolia', () => ({
  fetchAlgolia: (arg: FetchAlgoliaParameters) => mockFetchAlgolia(arg),
}))

const mockOnSuccess = jest.fn()
const mockOnError = jest.fn()

const props: UseFetchAlgoliaInterface = {
  algoliaParameters: { hitsPerPage: 10, title: 'param title' },
  extraParameters: { page: 0 },
  cacheKey: 'cacheKey',
  onSuccess: mockOnSuccess,
  onError: mockOnError,
}

describe('useFetchAlgolia', () => {
  afterEach(async () => {
    jest.clearAllMocks()
    await cleanup()
  })
  it('calls fetchAlgolia with params and returns data', async () => {
    const { result, waitForNextUpdate } = renderHook((props) => useFetchAlgolia(props), {
      initialProps: props,
      // eslint-disable-next-line react/display-name
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
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
    const { waitForNextUpdate } = renderHook((props) => useFetchAlgolia({ ...props }), {
      initialProps: { ...props },
      // eslint-disable-next-line react/display-name
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await act(async () => {
      await waitForNextUpdate()
    })

    expect(mockOnSuccess).toHaveBeenCalledWith({ hits: ['data'], nbHits: 10 })
    expect(mockOnError).not.toHaveBeenCalled()
  })
  it('calls onError on error', async () => {
    mockFetchAlgolia.mockRejectedValue(new Error('dummy-error'))

    const { waitForNextUpdate, result, waitFor } = renderHook((props) => useFetchAlgolia(props), {
      initialProps: props,
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
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
