import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { HISTORY_KEY, MAX_HISTORY_RESULTS, MIN_HISTORY_RESULTS } from 'features/search/constants'
import { getNativeCategoryFromEnum } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { getHistoryItemLabel } from 'features/search/helpers/getHistoryItemLabel/getHistoryItemLabel'
import { getHistoryLessThan30Days } from 'features/search/helpers/useSearchHistory/helpers/getHistoryLessThan30Days'
import { CreateHistoryItem, HistoryItem } from 'features/search/types'
import { eventMonitoring } from 'libs/monitoring'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export function useSearchHistory() {
  const { showErrorSnackBar } = useSnackBarContext()
  const { data: subcategoriesData } = useSubcategories()
  const searchGroupLabelMapping = useSearchGroupLabelMapping()
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [queryHistory, setQueryHistory] = useState<string>('')

  const setHistoryItems = useCallback(async (newItems: HistoryItem[]) => {
    return AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newItems))
  }, [])

  const getHistoryFromStorage = useCallback(async () => {
    try {
      const items = await AsyncStorage.getItem(HISTORY_KEY)

      if (!items) return []

      const history: HistoryItem[] = JSON.parse(items)

      const historyLessThan30Days = getHistoryLessThan30Days(history)
      await setHistoryItems(historyLessThan30Days)

      return historyLessThan30Days
    } catch (error) {
      return []
    }
  }, [setHistoryItems])

  useEffect(() => {
    getHistoryFromStorage().then(setHistory)
  }, [getHistoryFromStorage])

  const internalRemoveFromHistory = useCallback(
    async (item: HistoryItem) => {
      const lastHistory = await getHistoryFromStorage()
      const filteredItems = lastHistory.filter((i) => i.createdAt !== item.createdAt)
      await setHistoryItems(filteredItems)
      setHistory(filteredItems)
    },
    [getHistoryFromStorage, setHistoryItems]
  )

  const removeFromHistory = useCallback(
    async (item: HistoryItem) => {
      try {
        await internalRemoveFromHistory(item)
      } catch (error) {
        showErrorSnackBar({
          message: 'Impossible de supprimer l’entrée de l’historique',
          timeout: SNACK_BAR_TIME_OUT,
        })
      }
    },
    [internalRemoveFromHistory, showErrorSnackBar]
  )

  const addToHistory = useCallback(
    async (item: CreateHistoryItem) => {
      try {
        let currentHistory = await getHistoryFromStorage()

        const existingHistoryItem = currentHistory.find(
          (i) =>
            i.query === item.query &&
            i.nativeCategory === item.nativeCategory &&
            i.category === item.category
        )

        if (existingHistoryItem) {
          await internalRemoveFromHistory(existingHistoryItem)
          currentHistory = await getHistoryFromStorage()
        }

        const categoryLabel = item.category ? searchGroupLabelMapping[item.category] : undefined
        const nativeCategoryLabel =
          getNativeCategoryFromEnum(subcategoriesData, item.nativeCategory)?.value ?? undefined

        const newItems = [
          {
            ...item,
            createdAt: new Date().getTime(),
            label: getHistoryItemLabel({
              query: item.query,
              category: categoryLabel,
              nativeCategory: nativeCategoryLabel,
            }),
            categoryLabel,
            nativeCategoryLabel,
          },
          ...currentHistory,
        ]
        await setHistoryItems(newItems)
        setHistory(newItems)
      } catch (error) {
        eventMonitoring.captureMessage('Impossible d’ajouter l’entrée à l’historique', 'info')
      }
    },
    [
      getHistoryFromStorage,
      searchGroupLabelMapping,
      subcategoriesData,
      setHistoryItems,
      internalRemoveFromHistory,
    ]
  )

  const filteredHistory = useMemo(() => {
    const nbHistoryResults = queryHistory === '' ? MAX_HISTORY_RESULTS : MIN_HISTORY_RESULTS

    if (queryHistory === '') return history.slice(0, nbHistoryResults)

    return history
      .filter((item) => item.query.toLowerCase().includes(queryHistory.toLowerCase()))
      .slice(0, nbHistoryResults)
  }, [history, queryHistory])

  return {
    queryHistory,
    addToHistory,
    removeFromHistory,
    filteredHistory,
    setQueryHistory,
  }
}
