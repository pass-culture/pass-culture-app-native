import React from 'react'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { SelectionLabel } from 'features/search/components/SelectionLabel/SelectionLabel'
import { CategoryCriteria } from 'features/search/enums'
import { useAvailableCategories } from 'features/search/helpers/useAvailableCategories/useAvailableCategories'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'
import { Li } from 'ui/components/Li'
import { Ul } from 'ui/components/Ul'
import { getSpacing } from 'ui/theme'

type Props = {
  onChange: (selection: SearchGroupNameEnumv2 | undefined) => void
  selection: SearchGroupNameEnumv2 | undefined
}

export const OfferCategoryChoices = (props: Props) => {
  const categories = useAvailableCategories()
  return <CategoryChoices {...props} categories={categories} />
}

export const CategoryChoices = ({
  onChange,
  selection,
  categories,
}: Props & { categories: CategoryCriteria[] }) => {
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
              selected={selection === category.facetFilter}
              onPress={() =>
                onChange(selection === category.facetFilter ? undefined : category.facetFilter)
              }
            />
          </Li>
        ))}
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
