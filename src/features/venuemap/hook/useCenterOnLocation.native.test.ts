import { useCenterOnLocation } from 'features/venuemap/hook/useCenterOnLocation'
import { renderHook, waitFor } from 'tests/utils'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'

const WIDTH_MOCK = 300
const HEIGHT_MOCK = 500
const mockUseWindowDimensions = jest.fn().mockReturnValue({
  height: HEIGHT_MOCK,
  width: WIDTH_MOCK,
  scale: 1,
  fontScale: 1,
})
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: mockUseWindowDimensions,
}))

const HEADER_HEIGHT = 50
jest.mock('ui/components/headers/PageHeaderWithoutPlaceholder')
const mockUseGetHeaderHeight = useGetHeaderHeight as jest.Mock
mockUseGetHeaderHeight.mockReturnValue(HEADER_HEIGHT)

const currentRegion = {
  latitude: 48.8566,
  longitude: 2.3522,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
}
const previewHeight = 100
const pointForCoordinate = jest.fn()
const animateToRegion = jest.fn()

describe('useCenterOnLocation', () => {
  it('should center on location if the pin is too far on the left', async () => {
    pointForCoordinate.mockResolvedValueOnce({ x: 0, y: 200 })
    const centerOnLocation = renderUseCenterOnLocation()

    centerOnLocation(48.8566, 2)

    await waitFor(() => {
      expect(animateToRegion).toHaveBeenCalledWith({
        ...currentRegion,
        latitude: 48.8566,
        longitude: 2,
      })
    })
  })

  it('should center on location if the pin is too far on the right', async () => {
    pointForCoordinate.mockResolvedValueOnce({ x: WIDTH_MOCK, y: 200 })
    const centerOnLocation = renderUseCenterOnLocation()

    centerOnLocation(48.8566, 3)

    await waitFor(() => {
      expect(animateToRegion).toHaveBeenCalledWith({
        ...currentRegion,
        latitude: 48.8566,
        longitude: 3,
      })
    })
  })

  it('should center on location if the pin is too far on the top', async () => {
    pointForCoordinate.mockResolvedValueOnce({ x: 200, y: HEADER_HEIGHT })
    const centerOnLocation = renderUseCenterOnLocation()

    centerOnLocation(49, 2.3522)

    await waitFor(() => {
      expect(animateToRegion).toHaveBeenCalledWith({
        ...currentRegion,
        latitude: 49,
        longitude: 2.3522,
      })
    })
  })

  it('should center on location if the pin is too far on the bottom', async () => {
    pointForCoordinate.mockResolvedValueOnce({ x: 200, y: HEIGHT_MOCK - previewHeight })
    const centerOnLocation = renderUseCenterOnLocation()

    centerOnLocation(48, 2.3522)

    await waitFor(() => {
      expect(animateToRegion).toHaveBeenCalledWith({
        ...currentRegion,
        latitude: 48,
        longitude: 2.3522,
      })
    })
  })
})

const renderUseCenterOnLocation = () => {
  const mapViewRef = { current: { pointForCoordinate, animateToRegion } } as unknown as Parameters<
    typeof useCenterOnLocation
  >[0]['mapViewRef']
  const {
    result: { current: centerOnLocation },
  } = renderHook(() =>
    useCenterOnLocation({
      currentRegion,
      previewHeight,
      mapViewRef,
    })
  )
  return centerOnLocation
}
