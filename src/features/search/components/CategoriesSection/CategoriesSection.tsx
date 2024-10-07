import React, { FC } from 'react'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { CategoriesSectionItem } from 'features/search/components/CategoriesSectionItem/CategoriesSectionItem'
import { DescriptionContext } from 'features/search/types'
import { Li } from 'ui/components/Li'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { VerticalUl } from 'ui/components/Ul'
import { AccessibleBicolorIcon } from 'ui/svg/icons/types'
import { CategoryNode } from 'features/search/helpers/categoriesHelpers/categoryTree'

export interface CategoriesSectionProps<CategoryTree, N = keyof CategoryTree | null> {
  allLabel: string
  allValue: N
  data?: CategoryTree
  descriptionContext: DescriptionContext
  getIcon?: (categoryName: SearchGroupNameEnumv2) => FC<AccessibleBicolorIcon> | undefined
  onSelect: (item: N) => void
  onSubmit?: () => void
  value: N
}

export function CategoriesSection<CategoryTree, N = keyof CategoryTree | null>({
  allLabel,
  allValue,
  data,
  descriptionContext,
  getIcon,
  onSelect,
  onSubmit,
  value,
}: CategoriesSectionProps<CategoryTree, N>) {
  const sortSectionItems = (a: [string, CategoryNode], b: [string, CategoryNode]) => {
    if (!a[1]) return -1
    if (!b[1]) return 1

    const positionA = a[1].position ?? 1000
    const positionB = b[1].position ?? 1000
    return positionA - positionB
  }
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
        ? Object.entries<CategoryNode>(data)
            .sort(sortSectionItems)
            .map(([k, item]) => (
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
