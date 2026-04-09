import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { renderHook } from 'tests/utils'

import { useGoBack } from './useGoBack'

let mockCanGoBack = false

const mockNavigate = jest.fn()
const mockGoBack = jest.fn()
const mockPopTo = jest.fn()
let mockPreviousRouteName
jest.mock('@react-navigation/native', () => ({
  ...(jest.requireActual('@react-navigation/native') as Record<string, unknown>),
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
    popTo: mockPopTo,
    canGoBack: jest.fn(() => mockCanGoBack),
  }),
}))

jest.mock('features/navigation/helpers/usePreviousRouteName', () => ({
  usePreviousRouteName: jest.fn(() => mockPreviousRouteName),
}))

describe('useGoBack()', () => {
  describe('customCanGoBack()', () => {
    it.each([true, false])(
      'should always return same value as original function: "%s"',
      (canGoBackValue) => {
        mockCanGoBack = canGoBackValue
        const { result } = renderUseGoBack()

        expect(result.current.canGoBack()).toBe(canGoBackValue)
      }
    )
  })

  describe('customGoBack()', () => {
    it('should use navigate if canGoBack = false', () => {
      mockCanGoBack = false
      const { result } = renderUseGoBack()
      result.current.goBack()

      expect(mockPopTo).toHaveBeenCalledWith(...homeNavigationConfig)
    })

    it("should use navigate if previous route doesn't exist", () => {
      mockCanGoBack = true
      mockPreviousRouteName = undefined
      const { result } = renderUseGoBack()
      result.current.goBack()

      expect(mockPopTo).toHaveBeenCalledWith(...homeNavigationConfig)
    })

    it('should call goBack if previous route exists and canGoBack = true', () => {
      mockCanGoBack = true
      mockPreviousRouteName = 'Login'
      const { result } = renderUseGoBack()
      result.current.goBack()

      expect(mockGoBack).toHaveBeenCalledTimes(1)
    })
  })
})

function renderUseGoBack() {
  return renderHook(() => useGoBack(...homeNavigationConfig))
}
