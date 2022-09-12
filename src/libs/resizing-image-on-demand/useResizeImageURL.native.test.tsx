import { useWindowDimensions } from 'react-native'
import { useTheme } from 'styled-components/native'

import { useResizeImageURL } from 'libs/resizing-image-on-demand/useResizeImageURL'
import { renderHook } from 'tests/utils'

jest.mock('react-native', () => ({ useWindowDimensions: jest.fn() }))
jest.mock('styled-components/native')

const mockUseWindowDimensions = useWindowDimensions as jest.Mock
mockUseWindowDimensions.mockReturnValue({ scale: 1 })

const mockUseTheme = useTheme as jest.Mock
mockUseTheme.mockReturnValue({ isDesktopViewport: false })

describe('useResizeImageURL hook', () => {
  it('should return a smaller resized image URL on mobile', () => {
    const imageURL =
      'https://storage.googleapis.com/passculture-metier-ehp-testing-assets/thumbs/mediations/BF6Q'
    const { result } = renderHook(() => useResizeImageURL(imageURL))

    const expectedImageURL =
      'https://image-resizing-dot-passculture-metier-ehp.ew.r.appspot.com/?size=327&filename=passculture-metier-ehp-testing-assets-fine-grained/thumbs/mediations/BF6Q'
    expect(result.current).toEqual(expectedImageURL)
  })

  it('should return a larger resized image URL on web', () => {
    mockUseTheme.mockReturnValueOnce({
      isDesktopViewport: true,
    })
    const imageURL =
      'https://storage.googleapis.com/passculture-metier-ehp-testing-assets/thumbs/mediations/BF6Q'
    const { result } = renderHook(() => useResizeImageURL(imageURL))

    const expectedImageURL =
      'https://image-resizing-dot-passculture-metier-ehp.ew.r.appspot.com/?size=432&filename=passculture-metier-ehp-testing-assets-fine-grained/thumbs/mediations/BF6Q'
    expect(result.current).toEqual(expectedImageURL)
  })

  it('should return a smaller resized image URL when the pixel density is 2', () => {
    mockUseWindowDimensions.mockReturnValueOnce({ scale: 2 })
    const imageURL =
      'https://storage.googleapis.com/passculture-metier-ehp-testing-assets/thumbs/mediations/BF6Q'
    const { result } = renderHook(() => useResizeImageURL(imageURL))

    const expectedImageURL =
      'https://image-resizing-dot-passculture-metier-ehp.ew.r.appspot.com/?size=654&filename=passculture-metier-ehp-testing-assets-fine-grained/thumbs/mediations/BF6Q'
    expect(result.current).toEqual(expectedImageURL)
  })

})
