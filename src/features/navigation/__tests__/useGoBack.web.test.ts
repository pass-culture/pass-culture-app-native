import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { renderHook } from 'tests/utils'

import { useGoBack } from '../useGoBack'

let mockCanGoBack = false

jest.unmock('features/navigation/useGoBack')

const mockNavigate = jest.fn()
const mockGoBack = jest.fn()
const mockPreviousRoute: { name?: string } = { name: undefined }
jest.mock('@react-navigation/native', () => ({
  ...(jest.requireActual('@react-navigation/native') as Record<string, unknown>),
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
    canGoBack: jest.fn(() => mockCanGoBack),
  }),
}))

jest.mock('features/navigation/helpers/usePreviousRoute', () => ({
  usePreviousRoute: jest.fn(() => mockPreviousRoute),
}))

const actualHistory = window.history
const historySpy = jest.spyOn(window, 'history', 'get')
const mockHistoryBack = jest.fn()
historySpy.mockImplementation(() => ({
  ...actualHistory,
  back: mockHistoryBack,
}))

describe('useGoBack()', () => {
  describe('customCanGoBack()', () => {
    it('should return true if canGoBack = true', () => {
      mockCanGoBack = true
      const { result } = renderUseGoBack()
      expect(result.current.canGoBack()).toBeTruthy()
    })

    it.each([1, 2, 3])(
      'should return true if canGoBack = false but history length > 2 ',
      (historyLength) => {
        mockCanGoBack = false
        historySpy.mockImplementationOnce(() => ({
          ...actualHistory,
          length: historyLength,
        }))
        const { result } = renderUseGoBack()
        expect(result.current.canGoBack()).toBe(historyLength > 2)
      }
    )
  })

  describe('customGoBack()', () => {
    it('should use navigate if canGoBack = false', () => {
      mockCanGoBack = false
      const { result } = renderUseGoBack()
      result.current.goBack()
      expect(mockNavigate).toBeCalledWith(...homeNavConfig)
    })

    it("should use history if previous route doesn't exist and canGoBack = true", async () => {
      mockCanGoBack = true
      mockPreviousRoute.name = undefined

      const { result } = renderUseGoBack()
      result.current.goBack()
      expect(mockHistoryBack).toHaveBeenCalledTimes(1)
    })

    it('should call goBack if previous route exists and canGoBack = true', () => {
      mockCanGoBack = true
      mockPreviousRoute.name = 'Login'
      const { result } = renderUseGoBack()
      result.current.goBack()
      expect(mockGoBack).toHaveBeenCalledTimes(1)
    })
  })
})

function renderUseGoBack() {
  return renderHook(() => useGoBack(...homeNavConfig))
}
