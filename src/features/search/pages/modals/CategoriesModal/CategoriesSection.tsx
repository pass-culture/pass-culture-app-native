import React, { FC } from 'react'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { FilterRow } from 'features/search/components/FilterRow/FilterRow'
import {
  getDescription,
  getNbResultsFacetLabel,
} from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
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

type CategoriesMapping = MappingTree | MappedNativeCategories | MappedGenreTypes

interface CategoriesSectionProps<
  T extends CategoriesMapping,
  N = T extends MappingTree ? keyof MappingTree : keyof T | null
> {
  allLabel: string
  allValue: N
  data?: T
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
          marginVertical={getSpacing(3)}
          icon={handleGetIcon(SearchGroupNameEnumv2.NONE)}
        />
      </ListItem>

      {data
        ? Object.entries(data).map(([k, item]) => {
            const shouldHideArrow = !item.children
            const key = k as N
            const nbResultsFacet = getNbResultsFacetLabel(item.nbResultsFacet)

            return (
              <ListItem key={k}>
                <Spacer.Column numberOfSpaces={3} />

                {shouldHideArrow ? (
                  <RadioButton
                    label={item.label}
                    isSelected={key === value}
                    onSelect={() => handleSelect(key)}
                    icon={handleGetIcon(k as SearchGroupNameEnumv2)}
                    complement={nbResultsFacet}
                  />
                ) : (
                  <FilterRow
                    icon={handleGetIcon(k as SearchGroupNameEnumv2)}
                    shouldColorIcon
                    title={item.label}
                    description={getDescription(subcategoriesData, descriptionContext, k)}
                    onPress={() => handleSelect(key)}
                    captionId={k}
                    complement={nbResultsFacet}
                  />
                )}
                <Spacer.Column numberOfSpaces={3} />
              </ListItem>
            )
          })
        : null}
    </VerticalUl>
  )
}

const ListItem = styled(Li)({
  display: 'flex',
})
