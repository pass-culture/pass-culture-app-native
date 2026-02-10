import React, { FC } from 'react'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { CategoriesSectionItem } from 'features/search/components/CategoriesSectionItem/CategoriesSectionItem'
import { MappingTree } from 'features/search/helpers/categoriesHelpers/mapping-tree'
import {
  buildRadioOptions,
  CategoriesMapping,
  checkHasChildrenCategories,
  getLabelForValue,
  getSortedCategoriesEntries,
  getValueForLabel,
  toRadioButtonGroupOptions,
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
  shouldSortItems = true,
  value,
}: Readonly<CategoriesSectionProps<T, N>>) {
  const handleGetIcon = (category: SearchGroupNameEnumv2) => getIcon?.(category)

  const handleSelect = (key: N) => {
    onSelect(key)
  }

  const entries = getSortedCategoriesEntries(itemsMapping, shouldSortItems)
  const hasChildren = checkHasChildrenCategories(entries)

  if (!hasChildren) {
    const radioOptions = buildRadioOptions<N>(entries, allLabel, allValue)

    return (
      <RadioButtonGroup
        label="Sélectionne une option"
        value={getLabelForValue(radioOptions, value)}
        onChange={(newLabel) => {
          const selectedValue = getValueForLabel(radioOptions, newLabel)
          if (selectedValue === undefined) return
          handleSelect(selectedValue)
        }}
        variant="default"
        display="vertical"
        disabled={false}
        options={toRadioButtonGroupOptions(radioOptions)}
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
