import { useGetDefaultRegion } from 'features/venuemap/hook/useGetDefaultRegion'
import { renderHook } from 'tests/utils'

jest.mock('libs/location', () => ({
  useLocation: jest.fn(() => ({
    userLocation: {
      latitude: 48.8566,
      longitude: 2.3522,
    },
  })),
}))

const mockUseWindowDimensions = jest.fn().mockReturnValue({
  height: 700,
  width: 400,
  scale: 1,
  fontScale: 1,
})
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: mockUseWindowDimensions,
}))

describe('useGetDefaultRegion', () => {
  it('should return default region', () => {
    const { result } = renderHook(useGetDefaultRegion)

    expect(result.current).toEqual({
      latitude: 48.8566,
      latitudeDelta: 0.07799560849023598,
      longitude: 2.3522,
      longitudeDelta: 0.06773949313991143,
    })
  })
})
