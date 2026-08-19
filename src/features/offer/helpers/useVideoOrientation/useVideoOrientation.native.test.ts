// eslint-disable-next-line no-restricted-imports
import { Image } from 'react-native'

import { useVideoOrientation } from 'features/offer/helpers/useVideoOrientation/useVideoOrientation'
import { renderHook, waitFor } from 'tests/utils'

const VIDEO_ID = 'cmtxphwLDZ0'
const ORIGINAL_RATIO_THUMBNAIL_URL = `https://i.ytimg.com/vi/${VIDEO_ID}/oar2.jpg`

const mockGetSize = (width: number, height: number) =>
  jest
    .spyOn(Image, 'getSize')
    .mockImplementation((_uri, onSuccess) => Promise.resolve(onSuccess?.(width, height)))

const mockGetSizeFailure = () =>
  jest
    .spyOn(Image, 'getSize')
    .mockImplementation((_uri, _onSuccess, onError) =>
      Promise.resolve(onError?.(new Error('not found')))
    )

describe('useVideoOrientation', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should detect a portrait video from the original ratio thumbnail', async () => {
    mockGetSize(720, 1280)

    const { result } = renderHook(() => useVideoOrientation(VIDEO_ID))

    await waitFor(() => {
      expect(result.current.isPortrait).toBe(true)
    })
  })

  it('should expose the original ratio thumbnail url for a portrait video', async () => {
    mockGetSize(720, 1280)

    const { result } = renderHook(() => useVideoOrientation(VIDEO_ID))

    await waitFor(() => {
      expect(result.current.thumbnailUrl).toBe(ORIGINAL_RATIO_THUMBNAIL_URL)
    })
  })

  it('should probe the original ratio thumbnail url', () => {
    const getSize = mockGetSize(1920, 1080)

    renderHook(() => useVideoOrientation(VIDEO_ID))

    expect(getSize).toHaveBeenCalledWith(
      ORIGINAL_RATIO_THUMBNAIL_URL,
      expect.any(Function),
      expect.any(Function)
    )
  })

  it('should not detect a portrait video for a landscape video', async () => {
    mockGetSize(1920, 1080)

    const { result } = renderHook(() => useVideoOrientation(VIDEO_ID))

    await waitFor(() => {
      expect(result.current.isPortrait).toBe(false)
    })

    expect(result.current.thumbnailUrl).toBeUndefined()
  })

  it('should fall back to landscape when the thumbnail cannot be loaded', async () => {
    mockGetSizeFailure()

    const { result } = renderHook(() => useVideoOrientation(VIDEO_ID))

    await waitFor(() => {
      expect(result.current.isPortrait).toBe(false)
    })

    expect(result.current.thumbnailUrl).toBeUndefined()
  })

  it('should not probe anything without a video id', () => {
    const getSize = mockGetSize(720, 1280)

    const { result } = renderHook(() => useVideoOrientation(undefined))

    expect(getSize).not.toHaveBeenCalled()
    expect(result.current.isPortrait).toBe(false)
    expect(result.current.thumbnailUrl).toBeUndefined()
  })
})
