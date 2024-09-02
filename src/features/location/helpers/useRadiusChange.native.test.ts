import { mockLocationState } from 'features/location/fixtures/mockLocationState'
import { renderHook } from 'tests/utils'

import { useRadiusChange } from './useRadiusChange'

const mockProps = {
  ...mockLocationState,
  visible: false,
} as const

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

describe('useRadiusChange', () => {
  it('should call setTempAroundPlaceRadius when onTempAroundRadiusPlaceValueChange is called and visible is true', () => {
    const { result } = renderHook(() => useRadiusChange({ ...mockProps, visible: true }))
    const { onTempAroundRadiusPlaceValueChange } = result.current

    onTempAroundRadiusPlaceValueChange([10])

    expect(mockProps.setTempAroundPlaceRadius).toHaveBeenCalledWith(10)
  })

  it('should not call setTempAroundPlaceRadius when onTempAroundRadiusPlaceValueChange is called and visible is false', () => {
    const { result } = renderHook(() => useRadiusChange(mockProps))

    result.current.onTempAroundRadiusPlaceValueChange([10])

    expect(mockProps.setTempAroundPlaceRadius).not.toHaveBeenCalled()
  })

  it('should call setTempAroundMeRadius when onTempAroundMeRadiusValueChange is called and visible is true', () => {
    const { result } = renderHook(() => useRadiusChange({ ...mockProps, visible: true }))

    result.current.onTempAroundMeRadiusValueChange([20])

    expect(mockProps.setTempAroundMeRadius).toHaveBeenCalledWith(20)
  })

  it('should not call setTempAroundMeRadius when onTempAroundMeRadiusValueChange is called and visible is false', () => {
    const { result } = renderHook(() => useRadiusChange(mockProps))

    result.current.onTempAroundMeRadiusValueChange([20])

    expect(mockProps.setTempAroundMeRadius).not.toHaveBeenCalled()
  })
})
