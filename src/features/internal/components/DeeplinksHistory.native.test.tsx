import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'

import {
  DeeplinksHistory,
  DeeplinksHistoryProps,
} from 'features/internal/components/DeeplinksHistory'
import { render, screen, waitFor } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('<DeeplinksHistory />', () => {
  const history = [
    'https://passculture.app/recherche/resultats?locationFilter=%7B%22locationType%22%3A%22AROUND_ME%22%2C%22aroundRadius%22%3A%22all%22%7D&from=deeplink&utm_gen=marketing',
    'https://passculture.app/lieu/34323?from=deeplink&utm_gen=marketing',
  ] as const

  it('should display deeplinks history', () => {
    renderDeeplinksHistory({
      history,
      keepHistory: false,
      setKeepHistory: (keepHistory) => keepHistory,
      rehydrateHistory: (history) => history,
    })

    expect(screen.getByText('#0')).toBeOnTheScreen()
    expect(screen.getByText(history[0])).toBeOnTheScreen()

    expect(screen.getByText('#1')).toBeOnTheScreen()
    expect(screen.getByText(history[1])).toBeOnTheScreen()
  })

  it('should purge history when mac_persist is not true', async () => {
    const setKeepHistory = jest.fn()
    renderDeeplinksHistory({
      history,
      keepHistory: false,
      setKeepHistory,
      rehydrateHistory: (history) => history,
    })

    await waitFor(() => {
      expect(setKeepHistory).toHaveBeenCalledWith(false)
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('mac_persist')
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('mac_history')
    })
  })

  it('should not purge history when mac_persist is true', async () => {
    await AsyncStorage.setItem('mac_persist', 'true')
    await AsyncStorage.setItem('mac_history', JSON.stringify(history))
    const setKeepHistory = jest.fn()
    const rehydrateHistory = jest.fn()

    renderDeeplinksHistory({
      history: [],
      keepHistory: false,
      setKeepHistory,
      rehydrateHistory,
    })

    await waitFor(() => {
      expect(setKeepHistory).toHaveBeenCalledWith(true)
      expect(rehydrateHistory).toHaveBeenCalledWith(history)
    })
  })
})

function renderDeeplinksHistory({
  history,
  keepHistory,
  setKeepHistory,
  rehydrateHistory,
}: DeeplinksHistoryProps) {
  return render(
    <DeeplinksHistory
      history={history}
      keepHistory={keepHistory}
      setKeepHistory={setKeepHistory}
      rehydrateHistory={rehydrateHistory}
    />
  )
}
