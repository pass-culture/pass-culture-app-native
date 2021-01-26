import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { AccordionItem } from 'features/offer/components'
import { SelectionLabel, TitleWithCount } from 'features/search/atoms'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { CATEGORY_CRITERIA } from 'libs/algolia/enums'
import { _ } from 'libs/i18n'
import { getSpacing } from 'ui/theme'

// First we filter out the 'All' category
const categories = Object.values(CATEGORY_CRITERIA).filter((category) => !!category.facetFilter)

export const Category: React.FC = () => {
  const { searchState, dispatch } = useSearch()
  const { offerCategories } = searchState

  const onPress = (label: string) => () => {
    dispatch({ type: 'TOGGLE_CATEGORY', payload: label })
  }

  return (
    <AccordionItem
      defaultOpen={true}
      title={<TitleWithCount title={_(t`Catégories`)} count={offerCategories.length} />}>
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
