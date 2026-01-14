import { sortCategoriesPredicate } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import {
  BaseCategory,
  MappedGenreTypes,
  MappedNativeCategories,
  MappingTree,
} from 'features/search/helpers/categoriesHelpers/mapping-tree'

export type CategoriesMapping = MappingTree | MappedNativeCategories | MappedGenreTypes

type CategoriesMappingItem = {
  label: string
  nbResultsFacet?: number
  children?: CategoriesMapping
}

export type CategoryEntry = [string, CategoriesMappingItem]

type CategoryOption = {
  key: string
  label: string
  value: string
}

export function getSortedCategoriesEntries<T extends CategoriesMapping>(
  itemsMapping: T | undefined,
  shouldSortItems: boolean
): CategoryEntry[] {
  const entries: CategoryEntry[] = itemsMapping
    ? (Object.entries(itemsMapping) as CategoryEntry[])
    : []
  if (shouldSortItems) {
    entries.sort(([, a], [, b]) => sortCategoriesPredicate(a, b))
  }
  return entries
}

export function checkHasChildrenCategories(entries: CategoryEntry[]): boolean {
  return entries.some(([, item]) => Object.keys(item.children ?? {}).length > 0)
}

export function buildCategoryOptions<T extends BaseCategory>(
  entries: [string, T][],
  allLabel: string,
  allValue: string
): CategoryOption[] {
  return [
    {
      key: allValue,
      label: allLabel,
      value: allValue,
    },
    ...entries.map(([k, item]) => ({
      key: k,
      label: item.label,
      value: k,
    })),
  ]
}
