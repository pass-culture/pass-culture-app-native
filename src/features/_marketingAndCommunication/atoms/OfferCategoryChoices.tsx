import React, { useState } from 'react'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { SelectionLabel } from 'features/search/components/SelectionLabel/SelectionLabel'
import { availableCategories } from 'features/search/utils/availableCategories'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'
import { Li } from 'ui/components/Li'
import { Ul } from 'ui/components/Ul'
import { getSpacing } from 'ui/theme'

interface Props {
  onChange: (selection: SearchGroupNameEnumv2[]) => void
}

export const OfferCategoryChoices = (props: Props) => {
  const [selection, setSelection] = useState<SearchGroupNameEnumv2[]>([] as SearchGroupNameEnumv2[])
  const searchGroupLabelMapping = useSearchGroupLabelMapping()

  return (
    <BodyContainer>
      <StyledUl>
        {Object.entries(availableCategories).map(([category, { facetFilter }]) => (
          <Li key={category}>
            <SelectionLabel
              label={searchGroupLabelMapping[category as SearchGroupNameEnumv2]}
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
  flexDirection: 'column',
  marginBottom: getSpacing(-3),
  marginRight: getSpacing(-3),
})

const StyledUl = styled(Ul)({
  flexWrap: 'wrap',
})
