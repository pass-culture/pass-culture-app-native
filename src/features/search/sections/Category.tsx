import React from 'react'
import styled from 'styled-components/native'

import { SearchGroupNameEnum } from 'api/gen'
import { SelectionLabel, TitleWithCount } from 'features/search/atoms'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { useAvailableSearchCategories } from 'features/search/utils/useAvailableSearchCategories'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'
import { AccordionItem } from 'ui/components/AccordionItem'
import { getSpacing } from 'ui/theme'

export const Category: React.FC = () => {
  const { searchState, dispatch } = useStagedSearch()
  const { offerCategories } = searchState
  const logUseFilter = useLogFilterOnce(SectionTitle.Category)
  const categories = useAvailableSearchCategories()
  const searchGroupLabelMapping = useSearchGroupLabelMapping()

  const onPress = (facetFilter: SearchGroupNameEnum) => () => {
    dispatch({ type: 'TOGGLE_CATEGORY', payload: facetFilter })
    logUseFilter()
  }

  return (
    <AccordionItem
      defaultOpen={true}
      title={<TitleWithCount title={SectionTitle.Category} count={offerCategories.length} />}>
      <BodyContainer>
        {Object.entries(categories).map(([category, { facetFilter }]) => (
          <SelectionLabel
            key={category}
            label={searchGroupLabelMapping[category as SearchGroupNameEnum]}
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
