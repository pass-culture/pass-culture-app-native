import React, { useMemo, useState } from 'react'
import styled from 'styled-components/native'

import {
  NativeCategoryIdEnumv2,
  NativeCategoryResponseModelv2,
  SearchGroupNameEnumv2,
} from 'api/gen'
import { SelectionLabel } from 'features/search/components/SelectionLabel/SelectionLabel'
import { getNativeCategories } from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { Li } from 'ui/components/Li'
import { Ul } from 'ui/components/Ul'
import { getSpacing } from 'ui/theme'

interface Props {
  categories: SearchGroupNameEnumv2[]
  onChange: (selection: NativeCategoryIdEnumv2[]) => void
}

export const OfferNativeCategoryChoices = (props: Props) => {
  const [selection, setSelection] = useState<NativeCategoryIdEnumv2[]>(
    [] as NativeCategoryIdEnumv2[]
  )

  const { data } = useSubcategories()

  const nativeCategories = useMemo(() => {
    let nativeCategories: NativeCategoryResponseModelv2[] = []
    props.categories.forEach((categoryEnum) => {
      nativeCategories = [...nativeCategories, ...getNativeCategories(data, categoryEnum)]
    })
    return nativeCategories.sort((a, b) => (a?.value || '').localeCompare(b?.value || ''))
  }, [data, props.categories])

  const onPress = (nativeCategoryEnum: NativeCategoryIdEnumv2) => {
    setSelection((prevSelection) => {
      let nextSelection = [...prevSelection]
      if (nextSelection.includes(nativeCategoryEnum)) {
        nextSelection = []
      } else {
        nextSelection = [nativeCategoryEnum]
      }
      props.onChange(nextSelection)
      return nextSelection
    })
  }

  return (
    <BodyContainer>
      <StyledUl>
        {nativeCategories.map((nativeCategory) => (
          <Li key={nativeCategory.name}>
            <SelectionLabel
              label={nativeCategory.value || ''}
              selected={selection.includes(nativeCategory.name)}
              onPress={() => onPress(nativeCategory.name)}
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
