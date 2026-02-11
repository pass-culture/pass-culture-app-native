import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { HISTORY_KEY, MAX_HISTORY_RESULTS, MIN_HISTORY_RESULTS } from 'features/search/constants'
import { getNativeCategoryFromEnum } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { getHistoryItemLabel } from 'features/search/helpers/getHistoryItemLabel/getHistoryItemLabel'
import { getHistoryLessThan30Days } from 'features/search/helpers/useSearchHistory/helpers/getHistoryLessThan30Days'
import { CreateHistoryItem, HistoryItem } from 'features/search/types'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { LogTypeEnum } from 'libs/monitoring/errors'
import { eventMonitoring } from 'libs/monitoring/services'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'
import { useSubcategoriesQuery } from 'queries/subcategories/useSubcategoriesQuery'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'

export function useSearchHistory() {
  const { data: subcategoriesData } = useSubcategoriesQuery()
  const searchGroupLabelMapping = useSearchGroupLabelMapping()
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [queryHistory, setQueryHistory] = useState<string>('')
  const { logType } = useLogTypeFromRemoteConfig()

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
        showErrorSnackBar('Impossible de supprimer l’entrée de l’historique')
      }
    },
    [internalRemoveFromHistory]
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
        if (logType === LogTypeEnum.INFO)
          eventMonitoring.captureException('Impossible d’ajouter l’entrée à l’historique', {
            level: logType,
            extra: {
              query: item.query,
              nativeCategory: item.nativeCategory,
              category: item.category,
            },
          })
      }
    },
    [
      getHistoryFromStorage,
      searchGroupLabelMapping,
      subcategoriesData,
      setHistoryItems,
      internalRemoveFromHistory,
      logType,
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
