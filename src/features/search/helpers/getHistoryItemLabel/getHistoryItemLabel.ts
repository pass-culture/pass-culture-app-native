export type GetHistoryItemLabelProps = {
  query: string
  category?: string
  nativeCategory?: string
}

export function getHistoryItemLabel({ query, category, nativeCategory }: GetHistoryItemLabelProps) {
  if (nativeCategory || category) {
    const complement = nativeCategory ?? category
    if (complement) return `${query} dans ${complement}`
  }
  return query
}
