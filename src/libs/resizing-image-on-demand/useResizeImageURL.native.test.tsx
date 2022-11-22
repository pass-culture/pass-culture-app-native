import { useWindowDimensions } from 'react-native'
import { useTheme } from 'styled-components/native'

import { useAppSettings } from 'features/auth/settings'
import { useResizeImageURL } from 'libs/resizing-image-on-demand/useResizeImageURL'
import { renderHook } from 'tests/utils'

jest.mock('libs/environment')
jest.mock('react-native', () => ({ useWindowDimensions: jest.fn() }))
jest.mock('styled-components/native')
jest.mock('features/auth/settings')

const mockUseWindowDimensions = useWindowDimensions as jest.Mock
mockUseWindowDimensions.mockReturnValue({ scale: 1 })

const mockUseTheme = useTheme as jest.Mock
mockUseTheme.mockReturnValue({ isDesktopViewport: false })

const mockDefaultSettings = {
  enableFrontImageResizing: true,
  objectStorageUrl: 'https://localhost-storage',
}
const mockUseAppSettings = useAppSettings as jest.Mock
mockUseAppSettings.mockReturnValue({ data: mockDefaultSettings })

describe('useResizeImageURL hook', () => {
  it('should return a smaller resized image URL on a small screen', () => {
    const imageURL = 'https://localhost-storage/thumbs/mediations/BF6Q'
    const { result } = renderHook(() => useResizeImageURL({ imageURL }))

    const expectedImageURL =
      'https://image-resizing-dot-passculture-metier-ehp.ew.r.appspot.com/?size=327&filename=localhost-storage-v2/thumbs/mediations/BF6Q'
    expect(result.current).toEqual(expectedImageURL)
  })

  it('should return a larger resized image URL on a big screen', () => {
    mockUseTheme.mockReturnValueOnce({
      isDesktopViewport: true,
    })
    const imageURL = 'https://localhost-storage/thumbs/mediations/BF6Q'
    const { result } = renderHook(() => useResizeImageURL({ imageURL }))

    const expectedImageURL =
      'https://image-resizing-dot-passculture-metier-ehp.ew.r.appspot.com/?size=432&filename=localhost-storage-v2/thumbs/mediations/BF6Q'
    expect(result.current).toEqual(expectedImageURL)
  })

  it('should return a bigger resized image URL when the pixel density is 2', () => {
    mockUseWindowDimensions.mockReturnValueOnce({ scale: 2 })
    const imageURL = 'https://localhost-storage/thumbs/mediations/BF6Q'
    const { result } = renderHook(() => useResizeImageURL({ imageURL }))

    const expectedImageURL =
      'https://image-resizing-dot-passculture-metier-ehp.ew.r.appspot.com/?size=654&filename=localhost-storage-v2/thumbs/mediations/BF6Q'
    expect(result.current).toEqual(expectedImageURL)
  })

  it('should return the given image URL when the feature flag is off', () => {
    mockUseAppSettings.mockReturnValueOnce({
      data: { ...mockDefaultSettings, enableFrontImageResizing: false },
    })
    const imageURL = 'https://localhost-storage/thumbs/mediations/BF6Q'
    const { result } = renderHook(() => useResizeImageURL({ imageURL }))

    expect(result.current).toEqual(imageURL)
  })

  it('should return the resized image URL with custom dimensions when provided and height > width', () => {
    const imageURL = 'https://localhost-storage/thumbs/mediations/BF6Q'
    const { result } = renderHook(() => useResizeImageURL({ imageURL, height: 200, width: 100 }))

    const expectedImageURL =
      'https://image-resizing-dot-passculture-metier-ehp.ew.r.appspot.com/?size=200&filename=localhost-storage-v2/thumbs/mediations/BF6Q'
    expect(result.current).toEqual(expectedImageURL)
  })

  it('should return the resized image URL with custom dimensions when provided and width > height', () => {
    const imageURL = 'https://localhost-storage/thumbs/mediations/BF6Q'
    const { result } = renderHook(() => useResizeImageURL({ imageURL, height: 100, width: 200 }))

    const expectedImageURL =
      'https://image-resizing-dot-passculture-metier-ehp.ew.r.appspot.com/?size=200&filename=localhost-storage-v2/thumbs/mediations/BF6Q'
    expect(result.current).toEqual(expectedImageURL)
  })

  it('should return a bigger resized image URL with custom dimensions when provided and the pixel density is 2', () => {
    mockUseWindowDimensions.mockReturnValueOnce({ scale: 2 })
    const imageURL = 'https://localhost-storage/thumbs/mediations/BF6Q'
    const { result } = renderHook(() => useResizeImageURL({ imageURL, height: 200, width: 100 }))

    const expectedImageURL =
      'https://image-resizing-dot-passculture-metier-ehp.ew.r.appspot.com/?size=400&filename=localhost-storage-v2/thumbs/mediations/BF6Q'
    expect(result.current).toEqual(expectedImageURL)
  })
})
