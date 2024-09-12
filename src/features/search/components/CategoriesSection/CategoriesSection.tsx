import React, { FC } from 'react'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { CategoriesSectionItem } from 'features/search/components/CategoriesSectionItem/CategoriesSectionItem'
import { CategoryTree } from 'features/search/helpers/categoriesHelpers/categoryTree'
import {
  MappedGenreTypes,
  MappedNativeCategories,
  MappingTree,
} from 'features/search/helpers/categoriesHelpers/mapping-tree'
import { DescriptionContext } from 'features/search/types'
import { Li } from 'ui/components/Li'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { VerticalUl } from 'ui/components/Ul'
import { AccessibleBicolorIcon } from 'ui/svg/icons/types'

export type CategoriesMapping =
  | CategoryTree
  | MappingTree
  | MappedNativeCategories
  | MappedGenreTypes

export interface CategoriesSectionProps<
  T extends CategoriesMapping,
  N = T extends MappingTree ? keyof MappingTree : keyof T | null,
> {
  allLabel: string
  allValue: N
  data?: T
  descriptionContext: DescriptionContext
  getIcon?: T extends MappingTree | CategoryTree
    ? (categoryName: SearchGroupNameEnumv2) => FC<AccessibleBicolorIcon> | undefined
    : undefined
  onSelect: (item: N) => void
  onSubmit?: () => void
  value: N
}

export function CategoriesSection<
  T extends CategoriesMapping,
  N = T extends MappingTree ? keyof MappingTree : keyof T | null,
>({
  allLabel,
  allValue,
  data,
  descriptionContext,
  getIcon,
  onSelect,
  onSubmit,
  value,
}: CategoriesSectionProps<T, N>) {
  const handleGetIcon = (category: SearchGroupNameEnumv2) => {
    if (getIcon) {
      return getIcon(category)
    }

    return undefined
  }

  const handleSelect = (key: N) => {
    onSelect(key)
    if (onSubmit) {
      onSubmit()
    }
  }

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
      {data
        ? Object.entries(data).map(([k, item]) => (
            <CategoriesSectionItem
              key={k}
              value={value}
              k={k}
              item={item}
              descriptionContext={descriptionContext}
              handleSelect={handleSelect}
              handleGetIcon={handleGetIcon}
            />
          ))
        : null}
    </VerticalUl>
  )
}

const ListItem = styled(Li)({
  display: 'flex',
})
