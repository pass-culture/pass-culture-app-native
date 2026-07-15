import { env } from 'libs/environment/env'
import { act, renderHook } from 'tests/utils'

import {
  MAX_DEBUGGED_EVENTS,
  analyticsDebuggerActions,
  useAnalyticsDebuggerBubbleVisible,
  useAnalyticsDebuggerCaptureEnabled,
  useAnalyticsDebuggerEvents,
  useAnalyticsDebuggerOverlayVisible,
} from './analyticsDebuggerStore'

describe('analyticsDebuggerStore', () => {
  beforeEach(() => {
    analyticsDebuggerActions.setCaptureEnabled(true)
  })

  afterEach(() => {
    analyticsDebuggerActions.clearEvents()
    analyticsDebuggerActions.setCaptureEnabled(false)
    analyticsDebuggerActions.setBubbleVisible(false)
    analyticsDebuggerActions.hideOverlay()
    env.ANALYTICS_DEBUGGER_ENABLED = true
  })

  it('should capture an event with its name and params', () => {
    const { result } = renderHook(() => useAnalyticsDebuggerEvents())

    act(() => {
      analyticsDebuggerActions.captureEvent('ConsultArtist', { artistId: '42', from: 'offer' })
    })

    expect(result.current).toEqual([
      expect.objectContaining({
        name: 'ConsultArtist',
        params: { artistId: '42', from: 'offer' },
      }),
    ])
  })

  it('should keep the most recent event first', () => {
    const { result } = renderHook(() => useAnalyticsDebuggerEvents())

    act(() => {
      analyticsDebuggerActions.captureEvent('FirstEvent')
      analyticsDebuggerActions.captureEvent('SecondEvent')
    })

    expect(result.current.map((event) => event.name)).toEqual(['SecondEvent', 'FirstEvent'])
  })

  it(`should keep at most ${MAX_DEBUGGED_EVENTS} events`, () => {
    const { result } = renderHook(() => useAnalyticsDebuggerEvents())

    act(() => {
      Array.from({ length: MAX_DEBUGGED_EVENTS + 5 }).forEach((_, index) => {
        analyticsDebuggerActions.captureEvent(`Event${index}`)
      })
    })

    expect(result.current).toHaveLength(MAX_DEBUGGED_EVENTS)
    expect(result.current[0]?.name).toBe(`Event${MAX_DEBUGGED_EVENTS + 4}`)
  })

  it('should not capture events when capture is disabled', () => {
    analyticsDebuggerActions.setCaptureEnabled(false)
    const { result } = renderHook(() => useAnalyticsDebuggerEvents())

    act(() => {
      analyticsDebuggerActions.captureEvent('ConsultArtist')
    })

    expect(result.current).toEqual([])
  })

  it('should not capture events when the debugger is disabled on the environment', () => {
    env.ANALYTICS_DEBUGGER_ENABLED = false
    const { result } = renderHook(() => useAnalyticsDebuggerEvents())

    act(() => {
      analyticsDebuggerActions.captureEvent('ConsultArtist')
    })

    expect(result.current).toEqual([])
  })

  it('should clear captured events', () => {
    const { result } = renderHook(() => useAnalyticsDebuggerEvents())

    act(() => {
      analyticsDebuggerActions.captureEvent('ConsultArtist')
      analyticsDebuggerActions.clearEvents()
    })

    expect(result.current).toEqual([])
  })

  it('should toggle capture', () => {
    const { result } = renderHook(() => useAnalyticsDebuggerCaptureEnabled())

    expect(result.current).toBe(true)

    act(() => {
      analyticsDebuggerActions.setCaptureEnabled(false)
    })

    expect(result.current).toBe(false)
  })

  it('should show, hide and toggle the bubble', () => {
    const { result } = renderHook(() => useAnalyticsDebuggerBubbleVisible())

    expect(result.current).toBe(false)

    act(() => {
      analyticsDebuggerActions.setBubbleVisible(true)
    })

    expect(result.current).toBe(true)

    act(() => {
      analyticsDebuggerActions.toggleBubble()
    })

    expect(result.current).toBe(false)
  })

  it('should show, hide and toggle the overlay', () => {
    const { result } = renderHook(() => useAnalyticsDebuggerOverlayVisible())

    expect(result.current).toBe(false)

    act(() => {
      analyticsDebuggerActions.showOverlay()
    })

    expect(result.current).toBe(true)

    act(() => {
      analyticsDebuggerActions.hideOverlay()
    })

    expect(result.current).toBe(false)

    act(() => {
      analyticsDebuggerActions.toggleOverlay()
    })

    expect(result.current).toBe(true)
  })
})
