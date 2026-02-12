import React from 'react'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { FilterRow } from 'features/search/components/FilterRow/FilterRow'
import { getDescription } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import {
  CategoriesMapping,
  itemHasChildren,
} from 'features/search/helpers/categoriesSectionHelpers/categoriesSectionHelpers'
import { DescriptionContext } from 'features/search/types'
import { useSubcategoriesQuery } from 'queries/subcategories/useSubcategoriesQuery'
import { Li } from 'ui/components/Li'
import { RadioButton } from 'ui/designSystem/RadioButton/RadioButton'
import { AccessibleIcon } from 'ui/svg/icons/types'

type CategoriesMappingItem = {
  label: string
  children?: CategoriesMapping
}

interface CategoriesSectionItemProps<N> {
  value: N
  k: string
  item: CategoriesMappingItem
  descriptionContext: DescriptionContext
  handleSelect: (key: N) => void
  handleGetIcon: (category: SearchGroupNameEnumv2) => React.FC<AccessibleIcon> | undefined
}

export const CategoriesSectionItem = <N,>({
  value,
  k,
  item,
  descriptionContext,
  handleSelect,
  handleGetIcon,
}: CategoriesSectionItemProps<N>) => {
  const { data: subcategoriesData } = useSubcategoriesQuery()

  const shouldHideArrow = !itemHasChildren(item)
  const itemKey = k as N

  return (
    <ListItem>
      {shouldHideArrow ? (
        <RadioButtonContainer>
          <RadioButton
            label={item.label}
            value={itemKey === value ? item.label : ''}
            setValue={() => handleSelect(itemKey)}
            variant="default"
            disabled={false}
            error={false}
          />
        </RadioButtonContainer>
      ) : (
        <FilterRowContainer>
          <FilterRow
            icon={handleGetIcon(k as SearchGroupNameEnumv2)}
            shouldColorIcon
            title={item.label}
            description={getDescription(subcategoriesData, descriptionContext, k)}
            onPress={() => handleSelect(itemKey)}
            captionId={k}
          />
        </FilterRowContainer>
      )}
    </ListItem>
  )
}

const ListItem = styled(Li)({
  display: 'flex',
})

const FilterRowContainer = styled.View(({ theme }) => ({
  paddingVertical: theme.designSystem.size.spacing.m,
}))

const RadioButtonContainer = styled.View(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.s,
}))
