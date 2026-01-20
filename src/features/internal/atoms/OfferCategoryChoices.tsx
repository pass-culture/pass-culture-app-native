import React from 'react'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { SelectionLabel } from 'features/search/components/SelectionLabel/SelectionLabel'
import { CategoryCriteria } from 'features/search/enums'
import {
  useAvailableCategories,
  useAvailableThematicSearchCategories,
} from 'features/search/helpers/useAvailableCategories/useAvailableCategories'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'
import { Li } from 'ui/components/Li'
import { Ul } from 'ui/components/Ul'

type CategoryChoicesProps = {
  onChange: (selection: SearchGroupNameEnumv2[]) => void
  selection: SearchGroupNameEnumv2[]
}

type CategoryChoicesWithCategoryCriteria = CategoryChoicesProps & {
  categories: ReadonlyArray<CategoryCriteria>
}

export const OfferCategoryChoices = (props: CategoryChoicesProps) => {
  const categories = useAvailableCategories()
  return <CategoryChoices {...props} categories={categories} />
}

export const ThematicSearchCategoryChoices = (props: CategoryChoicesProps) => {
  const categories = useAvailableThematicSearchCategories()
  return <CategoryChoices {...props} categories={categories} />
}

const CategoryChoices = ({
  onChange,
  selection,
  categories,
}: CategoryChoicesWithCategoryCriteria) => {
  const searchGroupLabelMapping = useSearchGroupLabelMapping()

  if (categories.length === 0) {
    return null
  }

  return (
    <BodyContainer>
      <StyledUl>
        {categories.map((category) => (
          <Li key={category.facetFilter}>
            <SelectionLabel
              label={searchGroupLabelMapping[category.facetFilter]}
              selected={!!selection?.includes(category.facetFilter)}
              onPress={() =>
                onChange(selection?.includes(category.facetFilter) ? [] : [category.facetFilter])
              }
            />
          </Li>
        ))}
      </StyledUl>
    </BodyContainer>
  )
}

const BodyContainer = styled.View(({ theme }) => ({
  flexWrap: 'wrap',
  flexDirection: 'column',
  marginBottom: -theme.designSystem.size.spacing.m,
  marginRight: -theme.designSystem.size.spacing.m,
}))

const StyledUl = styled(Ul)({
  flexWrap: 'wrap',
})
