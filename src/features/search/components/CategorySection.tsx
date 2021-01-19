import { t } from '@lingui/macro'
import React, { useState } from 'react'
import styled from 'styled-components/native'

import { TitleWithCount } from 'features/offer/atoms/TitleWithCount'
import { AccordionItem } from 'features/offer/components'
import { SelectionLabel } from 'features/search/atoms/SelectionLabel'
import { CATEGORY_CRITERIA } from 'libs/algolia/enums'
import { _ } from 'libs/i18n'
import { getSpacing } from 'ui/theme'

interface SelectedMapping {
  [label: string]: boolean
}

// First we filter out the 'All' category
const categories = Object.values(CATEGORY_CRITERIA).filter((category) => !!category.facetFilter)
const initialMapping = categories.reduce(
  (previousValue: SelectedMapping, currentValue) => ({
    ...previousValue,
    [currentValue.label]: false,
  }),
  {}
)

export const CategorySection: React.FC = () => {
  const [selectedMapping, setSelectedMappping] = useState<SelectedMapping>(initialMapping)

  const onPress = (label: string) => () => {
    setSelectedMappping((prevMapping) => ({ ...prevMapping, [label]: !prevMapping[label] }))
  }

  return (
    <AccordionItem
      defaultOpen={true}
      title={
        <TitleWithCount
          title={_(t`Catégories`)}
          count={Object.values(selectedMapping).filter(Boolean).length}
        />
      }>
      <BodyContainer>
        {Object.entries(selectedMapping).map(([label, selected]) => (
          <SelectionLabel key={label} label={label} selected={selected} onPress={onPress(label)} />
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
