import { AppState } from 'react-native'
import InAppReview from 'react-native-in-app-review'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { eventMonitoring } from 'libs/monitoring/services'
import { clearHistory, readHistory } from 'libs/reviewInApp/reviewHistory'
import { REVIEW_LOCK_DURATION_MS, REVIEW_QUOTA_LIMIT } from 'libs/reviewInApp/types'
import { useReviewInApp } from 'libs/reviewInApp/useReviewInApp'
import { storage } from 'libs/storage'
import { act, renderHook, waitFor } from 'tests/utils'

jest.unmock('libs/appState')
const appStateSpy = jest.spyOn(AppState, 'addEventListener')

jest.mock('react-native-in-app-review')
const mockIsAvailable = InAppReview.isAvailable as jest.Mock
const mockRequestInAppReview = InAppReview.RequestInAppReview as jest.Mock

const captureExceptionSpy = jest.spyOn(eventMonitoring, 'captureException')

jest.useFakeTimers()

const NOW = 1_700_000_000_000

const flushAsync = () => act(async () => {})

describe('useReviewInApp', () => {
  beforeEach(async () => {
    jest.setSystemTime(NOW)
    await clearHistory()
    mockIsAvailable.mockReturnValue(true)
    mockRequestInAppReview.mockResolvedValue(true)
    setFeatureFlags()
    captureExceptionSpy.mockClear()
  })

  it('triggers the native review prompt after the requested delay', async () => {
    const { result } = renderHook(useReviewInApp)

    await act(async () => {
      await result.current.requestReview('booking_success', { delayMs: 3000 })
    })

    expect(mockRequestInAppReview).not.toHaveBeenCalled()

    jest.advanceTimersByTime(3000)

    expect(mockRequestInAppReview).toHaveBeenCalledTimes(1)
  })

  it('uses the default 1000ms delay when none is provided', async () => {
    const { result } = renderHook(useReviewInApp)

    await act(async () => {
      await result.current.requestReview('booking_success')
    })
    jest.advanceTimersByTime(999)

    expect(mockRequestInAppReview).not.toHaveBeenCalled()

    jest.advanceTimersByTime(1)

    expect(mockRequestInAppReview).toHaveBeenCalledTimes(1)
  })

  it('does nothing when InAppReview is not available (web case)', async () => {
    mockIsAvailable.mockReturnValueOnce(false)
    const { result } = renderHook(useReviewInApp)

    await act(async () => {
      await result.current.requestReview('booking_success', { delayMs: 3000 })
    })
    jest.advanceTimersByTime(3000)

    expect(mockRequestInAppReview).not.toHaveBeenCalled()
  })

  it('does nothing when WIP_DISABLE_STORE_REVIEW is on', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_DISABLE_STORE_REVIEW])
    const { result } = renderHook(useReviewInApp)

    await act(async () => {
      await result.current.requestReview('booking_success', { delayMs: 3000 })
    })
    jest.advanceTimersByTime(3000)

    expect(mockRequestInAppReview).not.toHaveBeenCalled()
  })

  it('does nothing when quota is reached (3 prompts within 365 days)', async () => {
    const longAgo = NOW - REVIEW_LOCK_DURATION_MS - 1
    await storage.saveObject('review_request_history', [longAgo, longAgo - 1000, longAgo - 2000])

    expect(REVIEW_QUOTA_LIMIT).toBe(3)

    const { result } = renderHook(useReviewInApp)

    await act(async () => {
      await result.current.requestReview('booking_success', { delayMs: 3000 })
    })
    jest.advanceTimersByTime(3000)

    expect(mockRequestInAppReview).not.toHaveBeenCalled()
  })

  it('does nothing when the 30 days lock is active', async () => {
    const recent = NOW - REVIEW_LOCK_DURATION_MS + 1
    await storage.saveObject('review_request_history', [recent])
    const { result } = renderHook(useReviewInApp)

    await act(async () => {
      await result.current.requestReview('booking_success', { delayMs: 3000 })
    })
    jest.advanceTimersByTime(3000)

    expect(mockRequestInAppReview).not.toHaveBeenCalled()
  })

  it('cancels the pending prompt when the app moves to background', async () => {
    const { result } = renderHook(useReviewInApp)

    await act(async () => {
      await result.current.requestReview('booking_success', { delayMs: 3000 })
    })
    // @ts-expect-error: because of noUncheckedIndexedAccess
    const triggerAppState = appStateSpy.mock.calls[0][1]
    act(() => {
      triggerAppState('active')
      triggerAppState('background')
    })
    jest.advanceTimersByTime(3000)

    expect(mockRequestInAppReview).not.toHaveBeenCalled()
  })

  it('records a timestamp in history on success', async () => {
    const { result } = renderHook(useReviewInApp)

    await act(async () => {
      await result.current.requestReview('booking_success', { delayMs: 3000 })
    })
    jest.advanceTimersByTime(3000)
    await flushAsync()

    await waitFor(async () => {
      expect(await readHistory(NOW + 3000)).toEqual([NOW + 3000])
    })
  })

  it('still records a timestamp when the native call fails (lock 30j is posted)', async () => {
    mockRequestInAppReview.mockRejectedValueOnce(new Error('OS refused'))
    const { result } = renderHook(useReviewInApp)

    await act(async () => {
      await result.current.requestReview('booking_success', { delayMs: 3000 })
    })
    jest.advanceTimersByTime(3000)
    await flushAsync()

    await waitFor(async () => {
      expect(await readHistory(NOW + 3000)).toEqual([NOW + 3000])
    })

    expect(captureExceptionSpy).toHaveBeenCalledTimes(1)
  })

  it('ignores concurrent calls while a prompt is already pending', async () => {
    const { result } = renderHook(useReviewInApp)

    await act(async () => {
      await result.current.requestReview('booking_success', { delayMs: 3000 })
      await result.current.requestReview('credit_received', { delayMs: 1000 })
    })
    jest.advanceTimersByTime(3000)

    expect(mockRequestInAppReview).toHaveBeenCalledTimes(1)
  })
})
