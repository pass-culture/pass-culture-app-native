import { canGoBack, goBack, useRoute, navigate } from '__mocks__/@react-navigation/native'

import { useBackNavigation } from '../backNavigation'
import { usePreviousRoute } from '../helpers'

jest.mock('features/navigation/helpers', () => ({
  usePreviousRoute: jest.fn(),
}))

const mockUsePreviousRoute = usePreviousRoute as jest.Mock

describe('Back Navigation', () => {
  const initialPageName = 'InitialPage'
  const initialPageParams = {
    one: 'value',
  }

  beforeEach(() =>
    useRoute.mockImplementation(() => ({
      params: {},
    }))
  )

  afterEach(() => jest.clearAllMocks())

  it('should navigate back using the given back navigation configuration', () => {
    useRoute.mockImplementation(() => ({
      params: {
        backNavigation: {
          from: initialPageName,
          params: initialPageParams,
        },
      },
    }))

    const complexGoBack = useBackNavigation()
    complexGoBack()

    expect(navigate).toHaveBeenCalledWith(initialPageName, initialPageParams)
    expect(goBack).not.toHaveBeenCalledWith()
  })
  it('should navigate back to the given previous route when goBack is possible', () => {
    mockUsePreviousRoute.mockImplementation(() => ({
      name: initialPageName,
    }))

    canGoBack.mockImplementation(() => true)

    const complexGoBack = useBackNavigation()
    complexGoBack()

    expect(goBack).toHaveBeenCalled()
    expect(navigate).not.toHaveBeenCalled()
  })
  describe('Fallback navigation', () => {
    it('should fallback when previous route name is not available', () => {
      const fallbackGoback = jest.fn()
      mockUsePreviousRoute.mockImplementation(() => ({
        name: undefined,
      }))

      canGoBack.mockImplementation(() => true)

      const complexGoBack = useBackNavigation(fallbackGoback)
      complexGoBack()

      expect(fallbackGoback).toHaveBeenCalled()
      expect(goBack).not.toHaveBeenCalled()
      expect(navigate).not.toHaveBeenCalled()
    })
    it('should fallback when going back is not possible (canGoBack=false)', () => {
      const fallbackGoback = jest.fn()
      mockUsePreviousRoute.mockImplementation(() => ({
        name: initialPageName,
      }))

      canGoBack.mockImplementation(() => false)

      const complexGoBack = useBackNavigation(fallbackGoback)
      complexGoBack()

      expect(fallbackGoback).toHaveBeenCalled()
      expect(goBack).not.toHaveBeenCalled()
      expect(navigate).not.toHaveBeenCalled()
    })
    it('should fallback to home when no other choices', () => {
      mockUsePreviousRoute.mockImplementation(() => ({
        name: initialPageName,
      }))

      canGoBack.mockImplementation(() => false)

      const complexGoBack = useBackNavigation()
      complexGoBack()

      expect(navigate).toHaveBeenCalledWith('Home', { shouldDisplayLoginModal: false })
      expect(goBack).not.toHaveBeenCalled()
    })
  })
})
