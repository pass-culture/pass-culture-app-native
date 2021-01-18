import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { AccordionItem } from 'features/offer/components'
import { SelectionLabel } from 'features/search/atoms/SelectionLabel'
import { CATEGORY_CRITERIA } from 'libs/algolia/enums'
import { _ } from 'libs/i18n'
import { getSpacing } from 'ui/theme'

export const CategorySection: React.FC = () => {
  // First we filter out the 'All' category
  const categories = Object.values(CATEGORY_CRITERIA).filter((category) => !!category.facetFilter)

  return (
    <AccordionContainer>
      <AccordionItem title={_(t`Catégories`)} defaultOpen={true}>
        <BodyContainer>
          {categories.map((category) => (
            <SelectionLabel key={category.label} label={category.label} />
          ))}
        </BodyContainer>
      </AccordionItem>
    </AccordionContainer>
  )
}

const AccordionContainer = styled.View({
  marginBottom: -getSpacing(4),
  marginTop: -getSpacing(6),
})
const BodyContainer = styled.View({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
  marginBottom: getSpacing(-3),
  marginRight: getSpacing(-3),
})
