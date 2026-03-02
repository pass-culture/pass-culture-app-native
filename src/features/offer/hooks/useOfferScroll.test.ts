import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

import { renderHook, act } from 'tests/utils'

import { useOfferScroll } from './useOfferScroll'

const mockOnScroll = jest.fn()
const mockHeaderTransition = {}

jest.mock('ui/animations/helpers/useOpacityTransition', () => ({
  useOpacityTransition: () => ({
    headerTransition: mockHeaderTransition,
    onScroll: mockOnScroll,
  }),
}))

const mockScrollListener = jest.fn()

const makeScrollEvent = (y: number) =>
  ({
    nativeEvent: {
      contentOffset: { y },
      layoutMeasurement: { height: 800 },
      contentSize: { height: 2000 },
    },
  }) as NativeSyntheticEvent<NativeScrollEvent>

describe('useOfferScroll', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return scrollViewRef', () => {
    const { result } = renderHook(() => useOfferScroll({ scrollListener: mockScrollListener }))

    expect(result.current.scrollViewRef).toBeDefined()
  })

  it('should return headerTransition', () => {
    const { result } = renderHook(() => useOfferScroll({ scrollListener: mockScrollListener }))

    expect(result.current.headerTransition).toBe(mockHeaderTransition)
  })

  it('should return handleScroll as a function', () => {
    const { result } = renderHook(() => useOfferScroll({ scrollListener: mockScrollListener }))

    expect(result.current.handleScroll).toBeInstanceOf(Function)
  })

  it('should return handleCheckScrollY as a function', () => {
    const { result } = renderHook(() => useOfferScroll({ scrollListener: mockScrollListener }))

    expect(result.current.handleCheckScrollY).toBeInstanceOf(Function)
  })

  it('should call onScroll from useOpacityTransition when handleScroll is called', () => {
    const { result } = renderHook(() => useOfferScroll({ scrollListener: mockScrollListener }))
    const event = makeScrollEvent(200)

    act(() => {
      result.current.handleScroll(event)
    })

    expect(mockOnScroll).toHaveBeenCalledWith(event)
  })

  it('should track scroll position via handleCheckScrollY', () => {
    const { result } = renderHook(() => useOfferScroll({ scrollListener: mockScrollListener }))

    expect(result.current.handleCheckScrollY()).toBe(0)

    act(() => {
      result.current.handleScroll(makeScrollEvent(350))
    })

    expect(result.current.handleCheckScrollY()).toBe(350)
  })
})
