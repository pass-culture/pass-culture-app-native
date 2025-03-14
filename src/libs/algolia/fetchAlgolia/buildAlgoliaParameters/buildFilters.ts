export const buildFilters = ({ excludedObjectIds }: { excludedObjectIds?: string[] }) => {
  const noFutureOffersFilter = 'NOT _tags:"is_future"'
  const excludedObjectIdsFilter =
    excludedObjectIds && excludedObjectIds.length > 0
      ? excludedObjectIds.map((objectId) => `AND NOT objectID:${objectId}`).join(' ')
      : ''

  return { filters: `${noFutureOffersFilter} ${excludedObjectIdsFilter}` }
}
