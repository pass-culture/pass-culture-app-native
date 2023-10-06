export function getHighlightedQuery(query: string, partToHighlight: string): string {
  if (partToHighlight === '') return query

  const escapedPartToHighlight = partToHighlight.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&')

  const regex = new RegExp(escapedPartToHighlight, 'gi')

  return query.replace(regex, '<mark>$&</mark>')
}
