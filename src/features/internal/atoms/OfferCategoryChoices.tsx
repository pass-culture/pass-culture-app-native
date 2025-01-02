import React from 'react'
import styled from 'styled-components/native'

import { SelectionLabel } from 'features/search/components/SelectionLabel/SelectionLabel'
import { Li } from 'ui/components/Li'
import { Ul } from 'ui/components/Ul'
import { getSpacing } from 'ui/theme'
import {
  CategoryKey,
  getTopLevelCategories,
} from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { hasAThematicSearch } from 'features/navigation/SearchStackNavigator/types'

type CategoryChoicesProps = {
  onChange: (selection: CategoryKey[]) => void
  selection: CategoryKey[]
}

type CategoryChoicesWithCategoryCriteria = CategoryChoicesProps & {
  categories: CategoryKey[]
}

export const OfferCategoryChoices = (props: CategoryChoicesProps) => {
  const categories = getTopLevelCategories().map((category) => category.key)
  return <CategoryChoices {...props} categories={categories} />
}

export const ThematicSearchCategoryChoices = (props: CategoryChoicesProps) => {
  return (
    <CategoryChoices
      {...props}
      categories={hasAThematicSearch.map((category) => category.valueOf())}
    />
  )
}

const CategoryChoices = ({
  onChange,
  selection,
  categories,
}: CategoryChoicesWithCategoryCriteria) => {
  if (categories.length === 0) {
    return null
  }

  return (
    <BodyContainer>
      <StyledUl>
        {categories.map((categoryKey) => {
          return (
            <Li key={categoryKey}>
              <SelectionLabel
                label={categoryKey}
                selected={!!selection?.includes(categoryKey)}
                onPress={() => onChange(selection?.includes(categoryKey) ? [] : [categoryKey])}
              />
            </Li>
          )
        })}
      </StyledUl>
    </BodyContainer>
  )
}

const BodyContainer = styled.View({
  flexWrap: 'wrap',
  flexDirection: 'column',
  marginBottom: getSpacing(-3),
  marginRight: getSpacing(-3),
})

const StyledUl = styled(Ul)({
  flexWrap: 'wrap',
})
