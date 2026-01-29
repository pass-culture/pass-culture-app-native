import { FavoriteSortBy } from 'features/favorites/types'
import { RadioButtonGroupOption } from 'ui/designSystem/RadioButtonGroup/types'

const SORT_OPTIONS: Record<FavoriteSortBy, string> = {
  RECENTLY_ADDED: 'Ajouté récemment',
  ASCENDING_PRICE: 'Prix croissant',
  AROUND_ME: 'Proximité géographique',
}

const sortOptionEntries = Object.entries(SORT_OPTIONS) as ReadonlyArray<
  readonly [FavoriteSortBy, string]
>

export const buildSortRadioOptions = (): RadioButtonGroupOption[] =>
  sortOptionEntries.map(([sortBy, label]) => ({
    key: sortBy,
    label,
  }))

export const getLabelFromSortBy = (sortBy: FavoriteSortBy): string => SORT_OPTIONS[sortBy]

export const getSortByFromLabel = (label: string): FavoriteSortBy | undefined => {
  const entry = sortOptionEntries.find(([, entryLabel]) => entryLabel === label)
  return entry?.[0]
}
