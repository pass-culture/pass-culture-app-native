import { renderHook } from 'tests/utils'

import { useRadiusChange } from './useRadiusChange'

const mockProps = {
  setTempAroundPlaceRadius: jest.fn(),
  setTempAroundMeRadius: jest.fn(),
}

describe('useRadiusChange', () => {
  it('should call setTempAroundPlaceRadius when onTempAroundRadiusPlaceValueChange is called', () => {
    const { result } = renderHook(() => useRadiusChange(mockProps))

    result.current.onTempAroundRadiusPlaceValueChange([10])

    expect(mockProps.setTempAroundPlaceRadius).toHaveBeenCalledWith(10)
  })

  it('should call setTempAroundMeRadius when onTempAroundMeRadiusValueChange is called', () => {
    const { result } = renderHook(() => useRadiusChange(mockProps))

    result.current.onTempAroundMeRadiusValueChange([20])

    expect(mockProps.setTempAroundMeRadius).toHaveBeenCalledWith(20)
  })
})
