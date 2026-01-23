import { useCenterOnLocation } from 'features/venueMap/hook/useCenterOnLocation'
import { renderHook, waitFor } from 'tests/utils'

const WIDTH_MOCK = 300

const mockUseWindowDimensions = jest.fn().mockReturnValue({
  width: WIDTH_MOCK,
  scale: 1,
  fontScale: 1,
})
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: mockUseWindowDimensions,
}))

jest.mock('styled-components', () => ({
  ...jest.requireActual('styled-components'),
  useTheme: () => ({
    designSystem: {
      size: {
        spacing: {
          l: 16,
        },
      },
    },
  }),
}))

const currentRegion = {
  latitude: 48.8566,
  longitude: 2.3522,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
}
const previewHeight = 100
const mapHeight = 700
const pointForCoordinate = jest.fn()
const animateToRegion = jest.fn()

describe('useCenterOnLocation', () => {
  it('should not center if MapRef is not defined', async () => {
    const {
      result: { current: centerOnLocation },
    } = renderHook(() =>
      useCenterOnLocation({ currentRegion, mapViewRef: { current: null }, mapHeight })
    )

    centerOnLocation(48.8566, 2, previewHeight)
    await waitFor(() => {
      expect(animateToRegion).not.toHaveBeenCalled()
    })
  })

  it('should center on location if the pin is too far on the left', async () => {
    pointForCoordinate.mockResolvedValueOnce({ x: 0, y: 200 })
    const centerOnLocation = renderUseCenterOnLocation()

    centerOnLocation(48.8566, 2, previewHeight)

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

    centerOnLocation(48.8566, 3, previewHeight)

    await waitFor(() => {
      expect(animateToRegion).toHaveBeenCalledWith({
        ...currentRegion,
        latitude: 48.8566,
        longitude: 3,
      })
    })
  })

  it('should center on location if the pin is too far on the top', async () => {
    pointForCoordinate.mockResolvedValueOnce({ x: 200, y: 0 })
    const centerOnLocation = renderUseCenterOnLocation()

    centerOnLocation(49, 2.3522, previewHeight)

    await waitFor(() => {
      expect(animateToRegion).toHaveBeenCalledWith({
        ...currentRegion,
        latitude: 49,
        longitude: 2.3522,
      })
    })
  })

  it('should center on location if the pin is too far on the bottom', async () => {
    pointForCoordinate.mockResolvedValueOnce({ x: 200, y: mapHeight - previewHeight })
    const centerOnLocation = renderUseCenterOnLocation()

    centerOnLocation(48, 2.3522, previewHeight)

    await waitFor(() => {
      expect(animateToRegion).toHaveBeenCalledWith({
        ...currentRegion,
        latitude: 48,
        longitude: 2.3522,
      })
    })
  })

  it('should not center if previewHeight is not given', async () => {
    pointForCoordinate.mockResolvedValueOnce({ x: 200, y: mapHeight - previewHeight })
    const centerOnLocation = renderUseCenterOnLocation()

    centerOnLocation(48, 2.3522)

    await waitFor(() => {
      expect(animateToRegion).not.toHaveBeenCalledWith()
    })
  })
})

const renderUseCenterOnLocation = () => {
  const mapViewRef = { current: { pointForCoordinate, animateToRegion } } as unknown as Parameters<
    typeof useCenterOnLocation
  >[0]['mapViewRef']
  const {
    result: { current: centerOnLocation },
  } = renderHook(() => useCenterOnLocation({ currentRegion, mapViewRef, mapHeight }))
  return centerOnLocation
}
