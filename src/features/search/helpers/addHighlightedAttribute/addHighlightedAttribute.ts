import { Highlighted, HistoryItem } from 'features/search/types'

type HighlightParams<TItem> = {
  item: TItem
  query: string
}

export function addHighlightedAttribute<TItem extends HistoryItem>({
  item,
  query,
}: HighlightParams<TItem>): Highlighted<TItem> {
  const valueToHighlight = query
    ? item.query.replace(
        new RegExp(query.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi'),
        '<mark>$&</mark>'
      )
    : item.query

  return {
    ...item,
    _highlightResult: {
      query: { value: valueToHighlight },
    },
  }
}
