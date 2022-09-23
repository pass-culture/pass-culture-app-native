export const buildFilters = ({ excludedObjectIds }: { excludedObjectIds?: string[] }) => {
  let filters = ''
  if (excludedObjectIds && excludedObjectIds.length > 0) {
    filters = excludedObjectIds
      .map((objectId, index) => `${index > 0 ? 'AND ' : ''}NOT objectID:${objectId}`)
      .join(' ')
  }
  return filters.length > 0 ? { filters } : {}
}
