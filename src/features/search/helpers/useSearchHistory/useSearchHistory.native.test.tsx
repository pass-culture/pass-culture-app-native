import AsyncStorage from '@react-native-async-storage/async-storage'
import mockdate from 'mockdate'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { mockedSearchHistory } from 'features/search/fixtures/mockedSearchHistory'
import { useSearchHistory } from 'features/search/helpers/useSearchHistory/useSearchHistory'
import { HistoryItem } from 'features/search/types'
import { eventMonitoring } from 'libs/monitoring'
import { act, renderHook } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

const TODAY_DATE = new Date('2023-09-26T00:00:00.000Z')

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
}))
describe('useSearchHistory', () => {
  beforeEach(async () => {
    mockdate.set(TODAY_DATE)
    await AsyncStorage.removeItem('search_history')
  })

  it('should initialize the history correctly', async () => {
    const { result } = renderHook(useSearchHistory)
    await act(async () => {})

    expect(result.current.history).toEqual([])
  })

  it('should return an empty array when loading history failed', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('Erreur'))
    const { result } = renderHook(useSearchHistory)

    await act(async () => {})

    expect(result.current.history).toEqual([])
  })

  it('should initialize the query history correctly', async () => {
    const { result } = renderHook(useSearchHistory)
    await act(async () => {})

    expect(result.current.queryHistory).toEqual('')
  })

  it('should load the history from storage correctly', async () => {
    await AsyncStorage.setItem('search_history', JSON.stringify(mockedSearchHistory))

    const { result } = renderHook(useSearchHistory)
    await act(async () => {})

    const mockedSearchHistoryLess30Days = mockedSearchHistory.slice(0, -1)
    expect(result.current.history).toEqual(mockedSearchHistoryLess30Days)
  })

  it('should add an item to the history', async () => {
    const { result } = renderHook(useSearchHistory)

    const item: HistoryItem = {
      addedDate: new Date('2023-09-26T09:00:00.000Z').getTime(),
      query: 'one piece',
      category: SearchGroupNameEnumv2.LIVRES,
    }
    await act(async () => {
      await result.current.addToHistory(item)
    })

    expect(result.current.history).toEqual([item])
  })

  it('should not capture a message in Sentry when adding to history does not fail', async () => {
    const { result } = renderHook(useSearchHistory)

    const item: HistoryItem = {
      addedDate: new Date('2023-09-26T09:00:00.000Z').getTime(),
      query: 'one piece',
      category: SearchGroupNameEnumv2.LIVRES,
    }
    await act(async () => {
      await result.current.addToHistory(item)
    })

    expect(eventMonitoring.captureMessage).not.toHaveBeenCalled()
  })

  it('should capture a message in Sentry when adding to history fails', async () => {
    // Set initial history
    jest.spyOn(AsyncStorage, 'setItem').mockImplementationOnce(() => Promise.resolve())
    // Set current history
    jest.spyOn(AsyncStorage, 'setItem').mockImplementationOnce(() => Promise.resolve())
    // Set add to history
    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('Erreur'))
    const { result } = renderHook(useSearchHistory)

    const item: HistoryItem = {
      addedDate: new Date('2023-09-26T09:00:00.000Z').getTime(),
      query: 'one piece',
      category: SearchGroupNameEnumv2.LIVRES,
    }

    await act(async () => {
      await result.current.addToHistory(item)
    })

    expect(eventMonitoring.captureMessage).toHaveBeenNthCalledWith(
      1,
      'Impossible d’ajouter l’entrée à l’historique',
      'info'
    )
  })

  it('should replace an item already present to the history', async () => {
    const { result } = renderHook(useSearchHistory)

    const item: HistoryItem = {
      addedDate: new Date('2023-09-26T09:00:00.000Z').getTime(),
      query: 'one piece',
      category: SearchGroupNameEnumv2.LIVRES,
    }
    await act(async () => {
      await result.current.addToHistory(item)
    })

    const otherItem: HistoryItem = {
      addedDate: new Date('2023-09-26T09:05:00.000Z').getTime(),
      query: 'one piece',
      category: SearchGroupNameEnumv2.LIVRES,
    }
    await act(async () => {
      await result.current.addToHistory(otherItem)
    })

    expect(result.current.history).toEqual([otherItem])
  })

  it('should update the local storage when added an item to the history', async () => {
    const { result } = renderHook(useSearchHistory)

    const item: HistoryItem = {
      addedDate: new Date('2023-09-26T09:00:00.000Z').getTime(),
      query: 'one piece',
      category: SearchGroupNameEnumv2.LIVRES,
    }
    await act(async () => {
      await result.current.addToHistory(item)
    })

    expect(AsyncStorage.setItem).toHaveBeenLastCalledWith('search_history', JSON.stringify([item]))
  })

  it('should remove an item from the history', async () => {
    const item: HistoryItem = {
      addedDate: new Date('2023-09-26T09:00:00.000Z').getTime(),
      query: 'one piece',
      category: SearchGroupNameEnumv2.LIVRES,
    }
    await AsyncStorage.setItem('search_history', JSON.stringify([item]))
    const { result } = renderHook(useSearchHistory)

    await act(async () => {})
    expect(result.current.history).toEqual([item])

    await act(async () => {
      result.current.removeFromHistory(item)
    })
    expect(result.current.history).toEqual([])
  })

  it('should not display error message when removing from history does not fail', async () => {
    const item: HistoryItem = {
      addedDate: new Date('2023-09-26T09:00:00.000Z').getTime(),
      query: 'one piece',
      category: SearchGroupNameEnumv2.LIVRES,
    }
    await AsyncStorage.setItem('search_history', JSON.stringify([item]))
    const { result } = renderHook(useSearchHistory)

    await act(async () => {
      await result.current.removeFromHistory(item)
    })

    expect(mockShowErrorSnackBar).not.toHaveBeenCalled()
  })

  it('should display error message when removing from history fails', async () => {
    const item: HistoryItem = {
      addedDate: new Date('2023-09-26T09:00:00.000Z').getTime(),
      query: 'one piece',
      category: SearchGroupNameEnumv2.LIVRES,
    }
    await AsyncStorage.setItem('search_history', JSON.stringify([item]))
    // Set initial history
    jest.spyOn(AsyncStorage, 'setItem').mockImplementationOnce(() => Promise.resolve())
    // Set current history
    jest.spyOn(AsyncStorage, 'setItem').mockImplementationOnce(() => Promise.resolve())
    // Set add to history
    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('Erreur'))
    const { result } = renderHook(useSearchHistory)

    await act(async () => {
      await result.current.removeFromHistory(item)
    })

    expect(mockShowErrorSnackBar).toHaveBeenNthCalledWith(1, {
      message: 'Impossible de supprimer l’entrée de l’historique',
      timeout: SNACK_BAR_TIME_OUT,
    })
  })

  it('should update the local storage when deleted an item from history', async () => {
    const item: HistoryItem = {
      addedDate: new Date('2023-09-26T09:00:00.000Z').getTime(),
      query: 'one piece',
      category: SearchGroupNameEnumv2.LIVRES,
    }
    await AsyncStorage.setItem('search_history', JSON.stringify([item]))
    const { result } = renderHook(useSearchHistory)

    await act(async () => {
      await result.current.removeFromHistory(item)
    })

    expect(AsyncStorage.setItem).toHaveBeenLastCalledWith('search_history', JSON.stringify([]))
  })

  it('should execute an history search with a query not empty', async () => {
    await AsyncStorage.setItem('search_history', JSON.stringify(mockedSearchHistory))
    const { result } = renderHook(useSearchHistory)

    await act(async () => {
      result.current.search('vinyle')
    })

    expect(result.current.history).toEqual([
      {
        addedDate: new Date('2023-09-25T09:02:00.000Z').getTime(),
        query: 'vinyle',
      },
    ])
  })

  it('should execute an history search with an empty query', async () => {
    await AsyncStorage.setItem('search_history', JSON.stringify(mockedSearchHistory))
    const { result } = renderHook(useSearchHistory)

    await act(async () => {
      result.current.search('')
    })

    const mockedSearchHistoryLess30Days = mockedSearchHistory.slice(0, -1)
    expect(result.current.history).toEqual(mockedSearchHistoryLess30Days)
  })
})
