// to fix bug provoked by export of customRender in tests/utils
// eslint-disable-next-line no-restricted-imports
import { renderHook, waitFor } from '@testing-library/react-native'
import { useWindowDimensions } from 'react-native'
import { useTheme } from 'styled-components/native'

import { useResizeImageURL } from 'libs/resizing-image-on-demand/useResizeImageURL'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { setSettings } from 'tests/setSettings'

jest.mock('react-native-keychain', () => ({
  getGenericPassword: jest.fn(),
  setGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
}))
jest.mock('react-native', () => {
  return {
    Platform: {
      OS: 'ios',
    },

    useWindowDimensions: jest.fn(),
  }
})
jest.mock('libs/environment/env')
jest.mock('styled-components/native')

const mockUseWindowDimensions = useWindowDimensions as jest.Mock
mockUseWindowDimensions.mockReturnValue({ scale: 1 })

const mockUseTheme = useTheme as jest.Mock
mockUseTheme.mockReturnValue({ isDesktopViewport: false })

describe('useResizeImageURL hook', () => {
  it('should return a smaller resized image URL on a small screen', async () => {
    setSettings()
    const imageURL = 'https://localhost-storage/thumbs/mediations/BF6Q'
    const { result } = renderHook(() => useResizeImageURL({ imageURL }), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    const expectedImageURL =
      'https://image-resizing-dot-passculture-metier-ehp.ew.r.appspot.com/?size=327&filename=localhost-storage-v2/thumbs/mediations/BF6Q'

    await waitFor(() => {
      expect(result.current).toEqual(expectedImageURL)
    })
  })

  it('should return a larger resized image URL on a big screen', async () => {
    mockUseTheme
      .mockReturnValueOnce({
        isDesktopViewport: true,
      })
      .mockReturnValueOnce({
        isDesktopViewport: true,
      })
    setSettings()
    const imageURL = 'https://localhost-storage/thumbs/mediations/BF6Q'
    const { result } = renderHook(() => useResizeImageURL({ imageURL }), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    const expectedImageURL =
      'https://image-resizing-dot-passculture-metier-ehp.ew.r.appspot.com/?size=432&filename=localhost-storage-v2/thumbs/mediations/BF6Q'

    await waitFor(() => {
      expect(result.current).toEqual(expectedImageURL)
    })
  })

  it('should return a bigger resized image URL when the pixel density is 2', async () => {
    setSettings()
    mockUseWindowDimensions.mockReturnValueOnce({ scale: 2 }).mockReturnValueOnce({ scale: 2 })
    const imageURL = 'https://localhost-storage/thumbs/mediations/BF6Q'
    const { result } = renderHook(() => useResizeImageURL({ imageURL }), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    const expectedImageURL =
      'https://image-resizing-dot-passculture-metier-ehp.ew.r.appspot.com/?size=654&filename=localhost-storage-v2/thumbs/mediations/BF6Q'

    await waitFor(() => {
      expect(result.current).toEqual(expectedImageURL)
    })
  })

  it('should return the given image URL when the feature flag is off', async () => {
    setSettings({ enableFrontImageResizing: false })
    const imageURL = 'https://localhost-storage/thumbs/mediations/BF6Q'
    const { result } = renderHook(() => useResizeImageURL({ imageURL }), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      expect(result.current).toEqual(imageURL)
    })
  })

  it('should return the resized image URL with custom dimensions when provided and height > width', async () => {
    setSettings()
    const imageURL = 'https://localhost-storage/thumbs/mediations/BF6Q'
    const { result } = renderHook(() => useResizeImageURL({ imageURL, height: 200, width: 100 }), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    const expectedImageURL =
      'https://image-resizing-dot-passculture-metier-ehp.ew.r.appspot.com/?size=200&filename=localhost-storage-v2/thumbs/mediations/BF6Q'

    await waitFor(() => {
      expect(result.current).toEqual(expectedImageURL)
    })
  })

  it('should return the resized image URL with custom dimensions when provided and width > height', async () => {
    setSettings()
    const imageURL = 'https://localhost-storage/thumbs/mediations/BF6Q'
    const { result } = renderHook(() => useResizeImageURL({ imageURL, height: 100, width: 200 }), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    const expectedImageURL =
      'https://image-resizing-dot-passculture-metier-ehp.ew.r.appspot.com/?size=200&filename=localhost-storage-v2/thumbs/mediations/BF6Q'

    await waitFor(() => {
      expect(result.current).toEqual(expectedImageURL)
    })
  })

  it('should return a bigger resized image URL with custom dimensions when provided and the pixel density is 2', async () => {
    setSettings()
    mockUseWindowDimensions.mockReturnValueOnce({ scale: 2 }).mockReturnValueOnce({ scale: 2 })
    const imageURL = 'https://localhost-storage/thumbs/mediations/BF6Q'
    const { result } = renderHook(() => useResizeImageURL({ imageURL, height: 200, width: 100 }), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    const expectedImageURL =
      'https://image-resizing-dot-passculture-metier-ehp.ew.r.appspot.com/?size=400&filename=localhost-storage-v2/thumbs/mediations/BF6Q'

    await waitFor(() => {
      expect(result.current).toEqual(expectedImageURL)
    })
  })
})
