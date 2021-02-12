import React from 'react'
import styled from 'styled-components/native'

import { AccordionItem } from 'features/offer/components'
import { SelectionLabel, TitleWithCount } from 'features/search/atoms'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { CATEGORY_CRITERIA } from 'libs/algolia/enums'
import { getSpacing } from 'ui/theme'

// First we filter out the 'All' category
const categories = Object.values(CATEGORY_CRITERIA).filter((category) => !!category.facetFilter)

export const Category: React.FC = () => {
  const { searchState, dispatch } = useStagedSearch()
  const { offerCategories } = searchState
  const logUseFilter = useLogFilterOnce(SectionTitle.Category)

  const onPress = (label: string) => () => {
    dispatch({ type: 'TOGGLE_CATEGORY', payload: label })
    logUseFilter()
  }

  return (
    <AccordionItem
      defaultOpen={true}
      title={<TitleWithCount title={SectionTitle.Category} count={offerCategories.length} />}>
      <BodyContainer>
        {categories.map(({ label, facetFilter }) => (
          <SelectionLabel
            key={label}
            label={label}
            selected={offerCategories.includes(facetFilter)}
            onPress={onPress(facetFilter)}
          />
        ))}
      </BodyContainer>
    </AccordionItem>
  )
}

const BodyContainer = styled.View({
  flexWrap: 'wrap',
  flexDirection: 'row',
  marginBottom: getSpacing(-3),
  marginRight: getSpacing(-3),
})
