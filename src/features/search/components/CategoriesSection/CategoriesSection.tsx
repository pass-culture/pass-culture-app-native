import React, { FC } from 'react'

import { CategoriesSectionItem } from 'features/search/components/CategoriesSectionItem/CategoriesSectionItem'
import { sortCategoriesPredicate } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { BaseCategory } from 'features/search/helpers/categoriesHelpers/mapping-tree'
import { VerticalUl } from 'ui/components/Ul'
import { AccessibleBicolorIcon } from 'ui/svg/icons/types'

export interface CategoriesSectionProps {
  category: BaseCategory
  choice?: BaseCategory
  getIcon?: (item?: BaseCategory) => FC<AccessibleBicolorIcon> | undefined
  onSelect: (item: BaseCategory) => void
  onSubmit?: () => void
}

export function CategoriesSection({
  category,
  choice,
  getIcon,
  onSelect,
}: Readonly<CategoriesSectionProps>) {
  const handleGetIcon = (item: BaseCategory) => {
    if (getIcon) {
      return getIcon(item)
    }

    return undefined
  }

  const items = category.children.sort((a, b) => sortCategoriesPredicate(a, b))

  return (
    <VerticalUl>
      {items.map((item) => (
        <CategoriesSectionItem
          isSelected={choice?.key === item.key}
          item={item}
          key={item.key}
          handleSelect={onSelect}
          handleGetIcon={handleGetIcon}
        />
      ))}
    </VerticalUl>
  )
}
