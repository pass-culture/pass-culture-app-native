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
    'https://passcultureapp.page.link/?link=https%3A%2F%2Fpassculture.app%2Frecherche&apn=app.passculture.webapp&isi=1557887412&ibi=app.passculture&efr=1',
    'https://passcultureapp.page.link/?link=https%3A%2F%2Fpassculture.app%2Flieu%2F34323&apn=app.passculture.webapp&isi=1557887412&ibi=app.passculture&efr=1',
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
