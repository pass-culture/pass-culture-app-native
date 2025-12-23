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
import { VerticalUl } from 'ui/components/Ul'
import { RadioButton } from 'ui/designSystem/RadioButton/RadioButton'
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
        <RadioButtonContainer>
          <RadioButton
            label={allLabel}
            value={value === allValue ? allLabel : ''}
            setValue={() => onSelect(allValue)}
            variant="default"
            disabled={false}
            error={false}
          />
        </RadioButtonContainer>
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

const RadioButtonContainer = styled.View(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.s,
}))
