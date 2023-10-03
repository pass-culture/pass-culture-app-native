import AsyncStorage from '@react-native-async-storage/async-storage'
import mockdate from 'mockdate'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { HISTORY_KEY, MAX_HISTORY_RESULTS } from 'features/search/constants'
import { mockedSearchHistory } from 'features/search/fixtures/mockedSearchHistory'
import { useSearchHistory } from 'features/search/helpers/useSearchHistory/useSearchHistory'
import { CreateHistoryItem, HistoryItem } from 'features/search/types'
import { eventMonitoring } from 'libs/monitoring'
import { placeholderData as mockData } from 'libs/subcategories/placeholderData'
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

jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

describe('useSearchHistory', () => {
  beforeEach(async () => {
    mockdate.set(TODAY_DATE)
    await AsyncStorage.removeItem(HISTORY_KEY)
  })

  it('should initialize the history correctly', async () => {
    const { result } = renderHook(useSearchHistory)
    await act(async () => {})

    expect(result.current.filteredHistory).toEqual([])
  })

  it('should return an empty array when loading history failed', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('Erreur'))
    const { result } = renderHook(useSearchHistory)

    await act(async () => {})

    expect(result.current.filteredHistory).toEqual([])
  })

  it('should initialize the query history correctly', async () => {
    const { result } = renderHook(useSearchHistory)
    await act(async () => {})

    expect(result.current.queryHistory).toEqual('')
  })

  it('should load the history from storage correctly', async () => {
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(mockedSearchHistory))

    const { result } = renderHook(useSearchHistory)
    await act(async () => {})

    expect(result.current.filteredHistory).toEqual(
      mockedSearchHistory.slice(0, MAX_HISTORY_RESULTS)
    )
  })

  it('should add an item to the history', async () => {
    const { result } = renderHook(useSearchHistory)

    const item: CreateHistoryItem = {
      query: 'one piece',
      category: SearchGroupNameEnumv2.LIVRES,
    }
    await act(async () => {
      await result.current.addToHistory(item)
    })

    expect(result.current.filteredHistory).toEqual([
      { ...item, createdAt: TODAY_DATE.getTime(), label: 'one piece dans Livres' },
    ])
  })

  it('should not capture a message in Sentry when adding to history does not fail', async () => {
    const { result } = renderHook(useSearchHistory)

    const item: CreateHistoryItem = {
      query: 'one piece',
      category: SearchGroupNameEnumv2.LIVRES,
    }
    await act(async () => {
      await result.current.addToHistory(item)
    })

    expect(eventMonitoring.captureMessage).not.toHaveBeenCalled()
  })

  it('should capture a message in Sentry when adding to history fails', async () => {
    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('Erreur'))
    const { result } = renderHook(useSearchHistory)

    const item: CreateHistoryItem = {
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

    const item: CreateHistoryItem = {
      query: 'one piece',
      category: SearchGroupNameEnumv2.LIVRES,
    }
    await act(async () => {
      await result.current.addToHistory(item)
    })

    await act(async () => {
      mockdate.set(TODAY_DATE.getTime() + 1000)
    })

    await act(async () => {
      await result.current.addToHistory(item)
    })

    expect(result.current.filteredHistory).toEqual([
      { ...item, createdAt: TODAY_DATE.getTime() + 1000, label: 'one piece dans Livres' },
    ])
  })

  it('should update the local storage when added an item to the history', async () => {
    const { result } = renderHook(useSearchHistory)

    const item: CreateHistoryItem = {
      query: 'one piece',
      category: SearchGroupNameEnumv2.LIVRES,
    }
    await act(async () => {
      await result.current.addToHistory(item)
    })

    expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(
      HISTORY_KEY,
      JSON.stringify([{ ...item, createdAt: TODAY_DATE.getTime(), label: 'one piece dans Livres' }])
    )
  })

  it('should remove an item from the history', async () => {
    const item: HistoryItem = {
      createdAt: new Date('2023-09-26T09:00:00.000Z').getTime(),
      query: 'one piece',
      category: SearchGroupNameEnumv2.LIVRES,
      label: 'one piece dans Livres',
    }
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify([item]))
    const { result } = renderHook(useSearchHistory)

    await act(async () => {})
    expect(result.current.filteredHistory).toEqual([item])

    await act(async () => {
      result.current.removeFromHistory(item)
    })
    expect(result.current.filteredHistory).toEqual([])
  })

  it('should not display error message when removing from history does not fail', async () => {
    const item: HistoryItem = {
      createdAt: new Date('2023-09-26T09:00:00.000Z').getTime(),
      query: 'one piece',
      category: SearchGroupNameEnumv2.LIVRES,
      label: 'one piece dans Livres',
    }
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify([item]))
    // Set current history
    jest.spyOn(AsyncStorage, 'setItem').mockImplementationOnce(() => Promise.resolve())

    const { result } = renderHook(useSearchHistory)

    await act(async () => {
      await result.current.removeFromHistory(item)
    })

    expect(mockShowErrorSnackBar).not.toHaveBeenCalled()
  })

  it('should display error message when removing from history fails', async () => {
    const item: HistoryItem = {
      createdAt: new Date('2023-09-26T09:00:00.000Z').getTime(),
      query: 'one piece',
      category: SearchGroupNameEnumv2.LIVRES,
      label: 'one piece dans Livres',
    }
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify([item]))
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
      createdAt: new Date('2023-09-26T09:00:00.000Z').getTime(),
      query: 'one piece',
      category: SearchGroupNameEnumv2.LIVRES,
      label: 'one piece dans Livres',
    }

    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify([item]))
    const { result } = renderHook(useSearchHistory)

    await act(async () => {
      await result.current.removeFromHistory(item)
    })

    expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(HISTORY_KEY, JSON.stringify([]))
  })

  it('should execute an history search with a query not empty', async () => {
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(mockedSearchHistory))
    const { result } = renderHook(useSearchHistory)

    await act(async () => {
      result.current.setQueryHistory('vinyle')
    })

    expect(result.current.filteredHistory).toEqual([
      {
        createdAt: new Date('2023-09-25T09:02:00.000Z').getTime(),
        query: 'vinyle',
        label: 'vinyle',
      },
    ])
  })

  it('should execute an history search with an empty query', async () => {
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(mockedSearchHistory))
    const { result } = renderHook(useSearchHistory)

    await act(async () => {
      result.current.setQueryHistory('')
    })

    expect(result.current.filteredHistory).toEqual(
      mockedSearchHistory.slice(0, MAX_HISTORY_RESULTS)
    )
  })

  it('should return 20 items maximum in the history when queryHistory is an empty string', async () => {
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(mockedSearchHistory))
    const { result } = renderHook(useSearchHistory)

    await act(async () => {
      result.current.setQueryHistory('')
    })

    expect(result.current.filteredHistory.length).toEqual(20)
  })

  it('should return 3 items maximum in the history when queryHistory is not an empty string', async () => {
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(mockedSearchHistory))
    const { result } = renderHook(useSearchHistory)

    await act(async () => {
      result.current.setQueryHistory('a')
    })

    expect(result.current.filteredHistory.length).toEqual(3)
  })
})
