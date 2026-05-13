import React from 'react'
import InAppReview from 'react-native-in-app-review'

import { CheatcodesNavigationReviewInApp } from 'cheatcodes/pages/features/reviewInApp/CheatcodesNavigationReviewInApp'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { clearHistory, readHistory } from 'libs/reviewInApp/reviewHistory'
import { storage } from 'libs/storage'
import { render, screen, userEvent, waitFor } from 'tests/utils'

jest.mock('react-native-in-app-review')
const mockIsAvailable = InAppReview.isAvailable as jest.Mock
const mockRequestInAppReview = InAppReview.RequestInAppReview as jest.Mock

jest.useFakeTimers()
const user = userEvent.setup()
const NOW = 1_700_000_000_000

describe('<CheatcodesNavigationReviewInApp/>', () => {
  beforeEach(async () => {
    jest.setSystemTime(NOW)
    await clearHistory()
    await storage.clear('times_review_has_been_requested')
    await storage.clear('first_time_review_has_been_requested')
    mockIsAvailable.mockReturnValue(true)
    mockRequestInAppReview.mockResolvedValue(true)
    setFeatureFlags()
  })

  it('renders the empty initial state', async () => {
    render(<CheatcodesNavigationReviewInApp />)

    await waitFor(() => {
      expect(screen.getByText(/quota restant\s*:\s*3\/3/)).toBeOnTheScreen()
    })

    expect(screen.getAllByText('Oui').length).toBeGreaterThan(0)
  })

  it('saturates the quota when pressing the dedicated button', async () => {
    render(<CheatcodesNavigationReviewInApp />)
    await waitFor(() => expect(screen.getByText(/quota restant\s*:\s*3\/3/)).toBeOnTheScreen())

    await user.press(screen.getByText('Saturer le quota (3 prompts récents)'))

    await waitFor(() => {
      expect(screen.getByText(/quota restant\s*:\s*0\/3/)).toBeOnTheScreen()
    })
    const stored = await readHistory(NOW)

    expect(stored).toHaveLength(3)
  })

  it('clears the history when pressing the reset button', async () => {
    await storage.saveObject('review_request_history', [NOW, NOW - 1000, NOW - 2000])

    render(<CheatcodesNavigationReviewInApp />)
    await waitFor(() => expect(screen.getByText(/quota restant\s*:\s*0\/3/)).toBeOnTheScreen())

    await user.press(screen.getByText('Vider l’historique'))

    await waitFor(() => {
      expect(screen.getByText(/quota restant\s*:\s*3\/3/)).toBeOnTheScreen()
    })

    expect(await readHistory(NOW)).toEqual([])
  })

  it('triggers the native prompt when pressing a source button', async () => {
    render(<CheatcodesNavigationReviewInApp />)
    await waitFor(() => expect(screen.getByText(/quota restant\s*:\s*3\/3/)).toBeOnTheScreen())

    await user.press(screen.getByText('Booking success'))
    jest.advanceTimersByTime(1000)

    await waitFor(() => {
      expect(mockRequestInAppReview).toHaveBeenCalledTimes(1)
    })
  })
})
