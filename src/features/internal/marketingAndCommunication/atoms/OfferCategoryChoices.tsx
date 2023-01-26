import React, { useCallback, useState } from 'react'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { SelectionLabel } from 'features/search/components/SelectionLabel/SelectionLabel'
import { useAvailableCategories } from 'features/search/helpers/useAvailableCategories/useAvailableCategories'
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
  const availableCategories = useAvailableCategories()

  const { onChange } = props

  const onPress = useCallback(
    (facetFilter: SearchGroupNameEnumv2) => {
      setSelection((prevSelection) => {
        let nextSelection = [...prevSelection]
        if (nextSelection.includes(facetFilter)) {
          nextSelection = []
        } else {
          nextSelection = [facetFilter]
        }
        onChange(nextSelection)
        return nextSelection
      })
    },
    [onChange]
  )

  if (availableCategories.length === 0) {
    return null
  }

  return (
    <BodyContainer>
      <StyledUl>
        {availableCategories.map((category) => (
          <Li key={category.facetFilter}>
            <SelectionLabel
              label={searchGroupLabelMapping[category.facetFilter]}
              selected={selection.includes(category.facetFilter)}
              onPress={() => onPress(category.facetFilter)}
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
