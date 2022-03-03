import React, { useState } from 'react'
import webStyled from 'styled-components'
import styled from 'styled-components/native'

import { SearchGroupNameEnum } from 'api/gen'
import { SelectionLabel } from 'features/search/atoms'
import { availableCategories } from 'features/search/utils/availableCategories'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'
import { getSpacing } from 'ui/theme'
import { Li } from 'ui/web/list/Li'
import { Ul } from 'ui/web/list/Ul'

interface Props {
  onChange: (selection: SearchGroupNameEnum[]) => void
}

export const OfferCategoryChoices = (props: Props) => {
  const [selection, setSelection] = useState<SearchGroupNameEnum[]>([] as SearchGroupNameEnum[])
  const searchGroupLabelMapping = useSearchGroupLabelMapping()

  return (
    <BodyContainer>
      <StyledUl>
        {Object.entries(availableCategories).map(([category, { facetFilter }]) => (
          <Li key={category}>
            <SelectionLabel
              label={searchGroupLabelMapping[category as SearchGroupNameEnum]}
              selected={selection.includes(facetFilter)}
              onPress={() => {
                setSelection((prevSelection) => {
                  let nextSelection = [...prevSelection]
                  if (nextSelection.includes(facetFilter)) {
                    nextSelection = nextSelection.filter((cat) => cat !== facetFilter)
                  } else {
                    nextSelection = [...nextSelection, facetFilter]
                  }
                  props.onChange(nextSelection)
                  return nextSelection
                })
              }}
            />
          </Li>
        ))}
      </StyledUl>
    </BodyContainer>
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
