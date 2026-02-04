import { sortCategoriesPredicate } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import {
  MappedGenreTypes,
  MappedNativeCategories,
  MappingTree,
} from 'features/search/helpers/categoriesHelpers/mapping-tree'
import { RadioButtonGroupOption } from 'ui/designSystem/RadioButtonGroup/types'

export type CategoriesMapping = MappingTree | MappedNativeCategories | MappedGenreTypes

type CategoriesMappingItem = {
  label: string
  children?: CategoriesMapping
}

export type CategoryEntry = [string, CategoriesMappingItem]

type RadioOption<K> = {
  key: string
  label: string
  value: K
}

export const getSortedCategoriesEntries = <T extends CategoriesMapping>(
  itemsMapping: T | undefined,
  shouldSortItems: boolean
): CategoryEntry[] => {
  const entries: CategoryEntry[] = itemsMapping ? Object.entries(itemsMapping) : []
  if (shouldSortItems) {
    entries.sort(([, a], [, b]) => sortCategoriesPredicate(a, b))
  }
  return entries
}

export const checkHasChildrenCategories = (entries: CategoryEntry[]): boolean =>
  entries.some(([, item]) => Object.keys(item.children ?? {}).length > 0)

export const buildRadioOptions = <K>(
  entries: CategoryEntry[],
  allLabel: string,
  allValue: K
): RadioOption<K>[] => [
  { key: allLabel, label: allLabel, value: allValue },
  ...entries.map(([key, item]) => ({
    key,
    label: item.label,
    value: key as K,
  })),
]

export const toRadioButtonGroupOptions = <K>(options: RadioOption<K>[]): RadioButtonGroupOption[] =>
  options.map(({ key, label }) => ({ key, label }))

export const getLabelForValue = <K>(options: RadioOption<K>[], value: K): string =>
  options.find((opt) => opt.value === value)?.label ?? ''

export const getValueForLabel = <K>(options: RadioOption<K>[], label: string): K | undefined =>
  options.find((opt) => opt.label === label)?.value
