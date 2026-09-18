import {
  SuggestionsSnapshot,
  SuggestionsStatus,
} from 'features/search/store/searchSuggestionsAccessibility.store'
import { HistoryItem } from 'features/search/types'

export function getSearchSuggestionsStatus({
  queryHistory,
  suggestions,
  filteredHistory,
  searchStatus,
  shouldDisplayArtistsSuggestions,
}: {
  queryHistory: string
  suggestions: {
    offers?: SuggestionsSnapshot
    venues?: SuggestionsSnapshot
    artists?: SuggestionsSnapshot
  }
  filteredHistory: HistoryItem[]
  searchStatus: string
  shouldDisplayArtistsSuggestions: boolean
}): SuggestionsStatus {
  const sections = [suggestions.offers, suggestions.venues]
  if (shouldDisplayArtistsSuggestions) sections.push(suggestions.artists)
  const isEmptyQuery = queryHistory.length === 0
  const ready =
    isEmptyQuery ||
    (searchStatus === 'idle' && sections.every((section) => section?.query === queryHistory))
  const totalSuggestions = isEmptyQuery
    ? 0
    : sections.reduce((total, section) => total + (section?.itemKeys.length ?? 0), 0)
  const historyItemLabel = filteredHistory.length > 1 ? 'éléments' : 'élément'
  let historyMessage = ''
  if (filteredHistory.length > 0) {
    historyMessage = ` Historique de recherche\u00a0: ${filteredHistory.length} ${historyItemLabel}.`
  }

  const suggestionLabel = totalSuggestions > 1 ? 'suggestions' : 'suggestion'
  let suggestionsMessage = 'Aucune suggestion'
  if (totalSuggestions > 0) {
    suggestionsMessage = `${totalSuggestions} ${suggestionLabel}`
  }
  const message = isEmptyQuery
    ? `Aucune suggestion de recherche.${historyMessage}`
    : `${suggestionsMessage} pour «\u00a0${queryHistory}\u00a0».${historyMessage}`
  const key = JSON.stringify([
    queryHistory,
    isEmptyQuery ? [] : sections.map((section) => section?.itemKeys),
    filteredHistory.map((item) => [item.createdAt, item.label]),
  ])

  return { query: queryHistory, key, message, ready }
}
