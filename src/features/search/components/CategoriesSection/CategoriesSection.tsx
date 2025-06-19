import React, { FC } from 'react'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { CategoriesSectionItem } from 'features/search/components/CategoriesSectionItem/CategoriesSectionItem'
import { sortCategoriesPredicate } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import {
  MappedGenreTypes,
  MappedNativeCategories,
  MappingTree,
} from 'features/search/helpers/categoriesHelpers/mapping-tree'
import { DescriptionContext } from 'features/search/types'
import { Li } from 'ui/components/Li'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { VerticalUl } from 'ui/components/Ul'
import { AccessibleIcon } from 'ui/svg/icons/types'

export type CategoriesMapping = MappingTree | MappedNativeCategories | MappedGenreTypes

export interface CategoriesSectionProps<
  T extends CategoriesMapping,
  N = T extends MappingTree ? keyof MappingTree : keyof T | null,
> {
  allLabel: string
  allValue: N
  descriptionContext: DescriptionContext
  getIcon?: T extends MappingTree
    ? (categoryName: SearchGroupNameEnumv2) => FC<AccessibleIcon> | undefined
    : undefined
  itemsMapping: T
  onSelect: (item: N) => void
  onSubmit?: () => void
  shouldSortItems?: boolean
  value: N
}

export function CategoriesSection<
  T extends CategoriesMapping,
  N = T extends MappingTree ? keyof MappingTree : keyof T | null,
>({
  allLabel,
  allValue,
  descriptionContext,
  getIcon,
  itemsMapping,
  onSelect,
  onSubmit,
  shouldSortItems = true,
  value,
}: Readonly<CategoriesSectionProps<T, N>>) {
  const handleGetIcon = (category: SearchGroupNameEnumv2) => getIcon?.(category)

  const handleSelect = (key: N) => {
    onSelect(key)
    onSubmit?.()
  }

  const entries = itemsMapping ? Object.entries(itemsMapping) : []
  if (shouldSortItems) entries.sort(([, a], [, b]) => sortCategoriesPredicate(a, b))

  return (
    <VerticalUl>
      <ListItem>
        <RadioButton
          label={allLabel}
          isSelected={value === allValue}
          onSelect={() => onSelect(allValue)}
          icon={handleGetIcon(SearchGroupNameEnumv2.NONE)}
        />
      </ListItem>
      {entries.map(([k, item]) => (
        <CategoriesSectionItem
          key={k}
          value={value}
          k={k}
          item={item}
          descriptionContext={descriptionContext}
          handleSelect={handleSelect}
          handleGetIcon={handleGetIcon}
        />
      ))}
    </VerticalUl>
  )
}

const ListItem = styled(Li)({
  display: 'flex',
})
