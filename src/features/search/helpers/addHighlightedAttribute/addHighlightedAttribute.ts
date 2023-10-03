import { getHighlightedQuery } from 'features/search/helpers/getHighlightedQuery/getHighlightedQuery'
import { Highlighted, HistoryItem } from 'features/search/types'

type HighlightParams<TItem> = {
  item: TItem
  query: string
}

export function addHighlightedAttribute<TItem extends HistoryItem>({
  item,
  query,
}: HighlightParams<TItem>): Highlighted<TItem> {
  const valueToHighlight = query ? getHighlightedQuery(item.query, query) : item.query

  return {
    ...item,
    _highlightResult: {
      query: { value: valueToHighlight },
    },
  }
}
