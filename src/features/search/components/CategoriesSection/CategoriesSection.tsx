import React, { FC } from 'react'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { CategoriesSectionItem } from 'features/search/components/CategoriesSectionItem/CategoriesSectionItem'
import { MappingTree } from 'features/search/helpers/categoriesHelpers/mapping-tree'
import {
  buildCategoryOptions,
  CategoriesMapping,
  checkHasChildrenCategories,
  getSortedCategoriesEntries,
} from 'features/search/helpers/categoriesSectionHelpers/categoriesSectionHelpers'
import { DescriptionContext } from 'features/search/types'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { RadioButton } from 'ui/designSystem/RadioButton/RadioButton'
import { RadioButtonGroup } from 'ui/designSystem/RadioButtonGroup/RadioButtonGroup'
import { AccessibleIcon } from 'ui/svg/icons/types'

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

  const entries = getSortedCategoriesEntries(itemsMapping, shouldSortItems)
  const hasChildren = checkHasChildrenCategories(entries)

  if (!hasChildren) {
    const options = buildCategoryOptions(entries, allLabel, allValue as string)
    const selectedOption = options.find((option) => option.value === value)
    return (
      <RadioButtonGroup
        label="Sélectionne une option"
        value={selectedOption?.label as string}
        onChange={(value) =>
          handleSelect(options.find((option) => option.label === value)?.value as N)
        }
        variant="default"
        display="vertical"
        disabled={false}
        error={false}
        options={options}
        errorText="Error"
      />
    )
  }

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
