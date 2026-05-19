import React from 'react'
import InAppReview from 'react-native-in-app-review'

import { CheatcodesNavigationReviewInApp } from 'cheatcodes/pages/features/reviewInApp/CheatcodesNavigationReviewInApp'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
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
    await storage.clear('offers_viewed_count')
    await storage.clear('times_review_has_been_requested')
    await storage.clear('first_time_review_has_been_requested')
    mockIsAvailable.mockReturnValue(true)
    mockRequestInAppReview.mockResolvedValue(true)
    setFeatureFlags([
      RemoteStoreFeatureFlags.WIP_REVIEW_TRIGGER_BOOKING,
      RemoteStoreFeatureFlags.WIP_REVIEW_TRIGGER_CREDIT,
      RemoteStoreFeatureFlags.WIP_REVIEW_TRIGGER_LIKE,
      RemoteStoreFeatureFlags.WIP_REVIEW_TRIGGER_OFFERS,
    ])
  })

  it('renders the empty initial state', async () => {
    render(<CheatcodesNavigationReviewInApp />)

    expect(await screen.findByText(/quota restant\s*:\s*3\/3/)).toBeOnTheScreen()
    expect(screen.getAllByText('Oui').length).toBeGreaterThan(0)
  })

  it('saturates the quota when pressing the dedicated button', async () => {
    render(<CheatcodesNavigationReviewInApp />)

    expect(await screen.findByText(/quota restant\s*:\s*3\/3/)).toBeOnTheScreen()

    await user.press(screen.getByText('Saturer le quota (3 prompts récents)'))

    expect(await screen.findByText(/quota restant\s*:\s*0\/3/)).toBeOnTheScreen()

    const stored = await readHistory(NOW)

    expect(stored).toHaveLength(3)
  })

  it('clears the history when pressing the reset button', async () => {
    await storage.saveObject('review_request_history', [NOW, NOW - 1000, NOW - 2000])

    render(<CheatcodesNavigationReviewInApp />)

    expect(await screen.findByText(/quota restant\s*:\s*0\/3/)).toBeOnTheScreen()

    await user.press(screen.getByText('Vider l’historique'))

    expect(await screen.findByText(/quota restant\s*:\s*3\/3/)).toBeOnTheScreen()
    expect(await readHistory(NOW)).toEqual([])
  })

  it('triggers the native prompt when pressing a source button', async () => {
    render(<CheatcodesNavigationReviewInApp />)

    expect(await screen.findByText(/quota restant\s*:\s*3\/3/)).toBeOnTheScreen()

    await user.press(screen.getByText('Booking success'))
    jest.advanceTimersByTime(1000)

    await waitFor(() => {
      expect(mockRequestInAppReview).toHaveBeenCalledTimes(1)
    })
  })

  it('renders the offers_viewed counter at 0 by default', async () => {
    render(<CheatcodesNavigationReviewInApp />)

    expect(await screen.findByText('0 / 10')).toBeOnTheScreen()
  })

  it('increments the offers_viewed counter when pressing the +1 button', async () => {
    render(<CheatcodesNavigationReviewInApp />)

    expect(await screen.findByText('0 / 10')).toBeOnTheScreen()

    await user.press(screen.getByText('Incrémenter d’1 (simuler une vue d’offre)'))

    expect(await screen.findByText('1 / 10')).toBeOnTheScreen()
  })

  it('seeds the offers_viewed counter at threshold-1', async () => {
    render(<CheatcodesNavigationReviewInApp />)

    expect(await screen.findByText('0 / 10')).toBeOnTheScreen()

    await user.press(screen.getByText(/Placer le compteur à 9/))

    expect(await screen.findByText('9 / 10')).toBeOnTheScreen()
  })

  it('resets the offers_viewed counter when pressing the reset button', async () => {
    await storage.saveObject('offers_viewed_count', 5)

    render(<CheatcodesNavigationReviewInApp />)

    expect(await screen.findByText('5 / 10')).toBeOnTheScreen()

    await user.press(screen.getByText('Réinitialiser le compteur'))

    expect(await screen.findByText('0 / 10')).toBeOnTheScreen()
  })
})
