import { AccessibilityInfo, Platform } from 'react-native'

import {
  SuggestionsAnnouncement,
  useAnnounceSearchSuggestions,
} from 'features/search/helpers/useAnnounceSearchSuggestions'
import { act, renderHook } from 'tests/utils'

const announcement = { key: 'first', message: '5 suggestions pour « manga ».' }
const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility')

describe.each(['ios', 'android'] as const)('Suggestions announcements on %s', (platform) => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.replaceProperty(Platform, 'OS', platform)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('groups successive updates and announces only the latest list', () => {
    const { result, rerender } = renderAnnouncement(announcement)
    act(() => jest.advanceTimersByTime(100))
    rerender({ announcement: { key: 'second', message: '8 suggestions pour « manga ».' } })
    act(() => jest.advanceTimersByTime(100))

    expect(announce).not.toHaveBeenCalled()

    act(() => jest.advanceTimersByTime(100))

    expect(announce).toHaveBeenCalledTimes(1)
    expect(result.current).toBe('8 suggestions pour « manga ».')
  })

  it('changes the text for successive replacements with the same count', () => {
    const { result, rerender } = renderAnnouncement(announcement)
    act(() => jest.advanceTimersByTime(200))
    rerender({ announcement: { ...announcement, key: 'second' } })
    act(() => jest.advanceTimersByTime(200))

    expect(result.current).toBe(`Suggestions mises à jour. ${announcement.message}`)

    rerender({ announcement: { ...announcement, key: 'third' } })
    act(() => jest.advanceTimersByTime(200))

    expect(result.current).toBe(announcement.message)
    expect(announce).toHaveBeenCalledTimes(3)
  })

  it('does not repeat an identical result after a refresh', () => {
    const { result, rerender } = renderAnnouncement(announcement)
    act(() => jest.advanceTimersByTime(200))
    rerender({ announcement: null })

    expect(result.current).toBe('')

    rerender({ announcement })
    act(() => jest.advanceTimersByTime(200))

    expect(result.current).toBe(announcement.message)
    expect(announce).toHaveBeenCalledTimes(1)
  })

  it('cancels pending speech while results are stale or the input is blurred', () => {
    const { result, rerender } = renderAnnouncement(announcement)
    rerender({ announcement: null })
    act(() => jest.advanceTimersByTime(200))

    expect(announce).not.toHaveBeenCalled()
    expect(result.current).toBe('')
  })

  it('cancels pending speech when leaving the screen', () => {
    const { rerender } = renderAnnouncement(announcement)
    rerender({ announcement, enabled: false })
    act(() => jest.advanceTimersByTime(200))

    expect(announce).not.toHaveBeenCalled()
  })

  it('cancels pending speech on unmount', () => {
    const { unmount } = renderAnnouncement(announcement)
    unmount()
    act(() => jest.advanceTimersByTime(200))

    expect(announce).not.toHaveBeenCalled()
  })
})

function renderAnnouncement(initial: SuggestionsAnnouncement) {
  return renderHook(
    ({
      announcement: next,
      enabled = true,
    }: {
      announcement: SuggestionsAnnouncement | null
      enabled?: boolean
    }) => useAnnounceSearchSuggestions(next, enabled),
    { initialProps: { announcement: initial } }
  )
}
