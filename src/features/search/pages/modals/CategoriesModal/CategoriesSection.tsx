import React, { FC } from 'react'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { FilterRow } from 'features/search/components/FilterRow/FilterRow'
import { getDescription } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import {
  MappedGenreTypes,
  MappedNativeCategories,
  MappingTree,
} from 'features/search/helpers/categoriesHelpers/mapping-tree'
import { DescriptionContext } from 'features/search/types'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { Li } from 'ui/components/Li'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { VerticalUl } from 'ui/components/Ul'
import { BicolorIconInterface } from 'ui/svg/icons/types'
import { getSpacing, Spacer } from 'ui/theme'

export type CategoriesMapping = MappingTree | MappedNativeCategories | MappedGenreTypes

interface CategoriesSectionProps<
  T extends CategoriesMapping,
  N = T extends MappingTree ? keyof MappingTree : keyof T | null
> {
  allLabel: string
  allValue: N
  data: T
  descriptionContext: DescriptionContext
  getIcon?: T extends MappingTree
    ? (categoryName: SearchGroupNameEnumv2) => FC<BicolorIconInterface> | undefined
    : undefined
  onSelect: (item: N) => void
  onSubmit?: () => void
  value: N
}

export function CategoriesSection<
  T extends CategoriesMapping,
  N = T extends MappingTree ? keyof MappingTree : keyof T | null
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
  const { data: subcategoriesData } = useSubcategories()

  const handleGetIcon = (category: SearchGroupNameEnumv2) => {
    if (getIcon) {
      return getIcon(category)
    }

    return undefined
  }

  const handleSelect = (key: N) => {
    if (onSubmit) {
      onSelect(key)
      onSubmit()
    }
    onSelect(key)
  }

  return (
    <VerticalUl>
      <ListItem>
        <RadioButton
          label={allLabel}
          isSelected={value === allValue}
          onSelect={() => onSelect(allValue)}
          marginVertical={getSpacing(3)}
          icon={handleGetIcon(SearchGroupNameEnumv2.NONE)}
        />
      </ListItem>

      {Object.entries(data).map(([k, item]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const shouldHideArrow = !(item as any).children
        const key = k as N

        return (
          <ListItem key={k}>
            <Spacer.Column numberOfSpaces={3} />

            {shouldHideArrow ? (
              <RadioButton
                label={item.label}
                isSelected={key === value}
                onSelect={() => handleSelect(key)}
                icon={handleGetIcon(k as SearchGroupNameEnumv2)}
              />
            ) : (
              <FilterRow
                icon={handleGetIcon(k as SearchGroupNameEnumv2)}
                shouldColorIcon
                title={item.label}
                description={getDescription(subcategoriesData, descriptionContext, k)}
                onPress={() => handleSelect(key)}
                captionId={k}
              />
            )}
            <Spacer.Column numberOfSpaces={3} />
          </ListItem>
        )
      })}
    </VerticalUl>
  )
}

const ListItem = styled(Li)({
  display: 'flex',
})
