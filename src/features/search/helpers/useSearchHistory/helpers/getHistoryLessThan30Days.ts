import { HistoryItem } from 'features/search/types'

export function getHistoryLessThan30Days(history: HistoryItem[]) {
  const thirtyDaysInMillis = 30 * 24 * 60 * 60 * 1000
  const currentDate = Date.now()

  return history.filter(
    (item) => item.createdAt && currentDate - item.createdAt <= thirtyDaysInMillis
  )
}
