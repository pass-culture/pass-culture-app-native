import React from 'react'
import webStyled from 'styled-components'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { SelectionLabel, TitleWithCount } from 'features/search/atoms'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { availableCategories } from 'features/search/utils/availableCategories'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'
import { AccordionItem } from 'ui/components/AccordionItem'
import { getSpacing } from 'ui/theme'
import { Li } from 'ui/web/list/Li'
import { Ul } from 'ui/web/list/Ul'

export const Category: React.FC = () => {
  const { searchState, dispatch } = useStagedSearch()
  const { offerCategories } = searchState
  const logUseFilter = useLogFilterOnce(SectionTitle.Category)
  const searchGroupLabelMapping = useSearchGroupLabelMapping()
  const titleID = uuidv4()

  const onPress = (facetFilter: SearchGroupNameEnumv2) => () => {
    dispatch({ type: 'TOGGLE_CATEGORY', payload: facetFilter })
    logUseFilter()
  }

  return (
    <AccordionItem
      defaultOpen={true}
      title={
        <TitleWithCount
          titleID={titleID}
          title={SectionTitle.Category}
          count={offerCategories.length}
          ariaLive="polite"
        />
      }
      accessibilityTitle={SectionTitle.Category}>
      <BodyContainer aria-labelledby={titleID} accessibilityRole={AccessibilityRole.GROUP}>
        <StyledUl>
          {Object.entries(availableCategories).map(([category, { facetFilter }]) => (
            <Li key={category}>
              <SelectionLabel
                label={searchGroupLabelMapping[category as SearchGroupNameEnumv2]}
                selected={offerCategories.includes(facetFilter)}
                onPress={onPress(facetFilter)}
              />
            </Li>
          ))}
        </StyledUl>
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

const StyledUl = webStyled(Ul)({
  flexWrap: 'wrap',
})
