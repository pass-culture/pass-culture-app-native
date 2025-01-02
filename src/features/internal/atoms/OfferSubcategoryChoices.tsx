import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components/native'

import { SelectionLabel } from 'features/search/components/SelectionLabel/SelectionLabel'
import {
  CategoryKey,
  getCategoryChildren,
} from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { Li } from 'ui/components/Li'
import { Ul } from 'ui/components/Ul'
import { getSpacing } from 'ui/theme'

interface Props {
  categories: CategoryKey[]
  onChange: (selection: CategoryKey[]) => void
}

export const OfferSubcategoryChoices = (props: Props) => {
  const [selection, setSelection] = useState<CategoryKey[]>([])

  const { data } = useSubcategories()
  const { categories, onChange } = props

  const subcategories = useMemo(
    () =>
      categories
        .map((categoryKey) => getCategoryChildren(categoryKey))
        .flat()
        .sort((a, b) => a.label.localeCompare(b.label)),
    [data, categories]
  )

  const onPress = useCallback(
    (subcategoryKey: CategoryKey) => {
      setSelection((prevSelection) => {
        const nextSelection = prevSelection.includes(subcategoryKey) ? [] : [subcategoryKey]
        onChange(nextSelection)
        return nextSelection
      })
    },
    [onChange]
  )

  return (
    <BodyContainer>
      <StyledUl>
        {subcategories.map((subcategory) => (
          <Li key={subcategory.key}>
            <SelectionLabel
              label={subcategory.label ?? ''}
              selected={selection.includes(subcategory.key)}
              onPress={() => onPress(subcategory.label)}
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
