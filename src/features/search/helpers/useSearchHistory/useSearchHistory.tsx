import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { getHistoryLessThan30Days } from 'features/search/helpers/useSearchHistory/helpers/getHistoryLessThan30Days'
import { HistoryItem } from 'features/search/types'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export function useSearchHistory() {
  const { showErrorSnackBar } = useSnackBarContext()
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [queryHistory, setQueryHistory] = useState<string>('')

  const setHistoryItems = useCallback(
    async (newItems: HistoryItem[]) => {
      try {
        await AsyncStorage.setItem('search_history', JSON.stringify(newItems))
      } catch (error) {
        if (error instanceof Error) {
          showErrorSnackBar({
            message: 'Impossible de mettre à jour l’historique',
          })
        }
      }
    },
    [showErrorSnackBar]
  )

  const getHistoryFromStorage = useMemo(
    () => async () => {
      try {
        const items = (await AsyncStorage.getItem('search_history')) ?? '[]'
        const history: HistoryItem[] = JSON.parse(items)

        const historyLessThan30Days = getHistoryLessThan30Days(history)
        await setHistoryItems(historyLessThan30Days)

        return historyLessThan30Days
      } catch (error) {
        return []
      }
    },
    [setHistoryItems]
  )

  useEffect(() => {
    const fetchHistory = async () => {
      const historyData = await getHistoryFromStorage()
      setHistory(historyData)
    }

    fetchHistory()
  }, [getHistoryFromStorage])

  const removeFromHistory = useCallback(
    async (item: HistoryItem) => {
      try {
        const currentHistory = await getHistoryFromStorage()
        const filteredItems = currentHistory.filter((i) => i.query !== item.query)
        if (filteredItems.length < currentHistory.length) {
          await setHistoryItems(filteredItems)
          setHistory(filteredItems)
        }
      } catch (error) {
        if (error instanceof Error) {
          showErrorSnackBar({
            message: 'Impossible de supprimer l’entrée de l’historique',
          })
        }
      }
    },
    [getHistoryFromStorage, showErrorSnackBar, setHistoryItems]
  )

  const addToHistory = useCallback(
    async (item: HistoryItem) => {
      try {
        let currentHistory = await getHistoryFromStorage()
        if (
          currentHistory.some(
            (i) =>
              i.query === item.query &&
              i.nativeCategory === item.nativeCategory &&
              i.category === item.category
          )
        ) {
          await removeFromHistory(item)
          currentHistory = await getHistoryFromStorage()
        }

        const newItems = [item, ...currentHistory]
        await setHistoryItems(newItems)
        setHistory(newItems)
      } catch (error) {
        showErrorSnackBar({
          message: 'Impossible d’ajouter l’entrée à l’historique',
        })
      }
    },
    [getHistoryFromStorage, setHistoryItems, removeFromHistory, showErrorSnackBar]
  )

  const search = useCallback(
    async (query: string) => {
      setQueryHistory(query)
      const currentHistory = await getHistoryFromStorage()
      if (query.trim() === '') {
        setHistory(currentHistory)
      }
      const filteredHistory = currentHistory.filter((item) =>
        item.query.toLowerCase().includes(query.toLowerCase())
      )
      setHistory(filteredHistory)
    },
    [getHistoryFromStorage]
  )

  return {
    history,
    queryHistory,
    addToHistory,
    removeFromHistory,
    search,
  }
}
