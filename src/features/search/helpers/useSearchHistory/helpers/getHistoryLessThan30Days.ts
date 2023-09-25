import { HistoryItem } from 'features/search/types'

export function getHistoryLessThan30Days(history: HistoryItem[]) {
  const thirtyDaysInMillis = 30 * 24 * 60 * 60 * 1000
  const currentDate = new Date().getTime()

  const filteredHistory = history.filter((item) => {
    return currentDate - item.addedDate <= thirtyDaysInMillis
  })

  return filteredHistory
}
