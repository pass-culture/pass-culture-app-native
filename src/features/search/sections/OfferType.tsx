import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { AccordionItem } from 'features/offer/components'
import { SelectionLabel, TitleWithCount } from 'features/search/atoms'
import { SearchState } from 'features/search/pages/reducer'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { _ } from 'libs/i18n'
import { getSpacing } from 'ui/theme'

type OfferType = keyof SearchState['offerTypes']

export const OFFER_TYPES: Array<[OfferType, string]> = [
  ['isDigital', _(t`Offre numérique`)],
  ['isEvent', _(t`Sorties`)],
  ['isThing', _(t`Offre physique`)],
]

export const OfferType: React.FC = () => {
  const logUseFilter = useLogFilterOnce(SectionTitle.OfferType)
  const { searchState, dispatch } = useSearch()
  const { offerTypes } = searchState

  const onPress = (offerType: OfferType) => () => {
    dispatch({ type: 'OFFER_TYPE', payload: offerType })
    logUseFilter()
  }

  return (
    <AccordionItem
      defaultOpen={true}
      title={
        <TitleWithCount
          title={SectionTitle.OfferType}
          count={+offerTypes['isDigital'] + +offerTypes['isEvent'] + +offerTypes['isThing']}
        />
      }>
      <BodyContainer>
        {OFFER_TYPES.map(([offerType, label]) => (
          <SelectionLabel
            key={label}
            label={label}
            selected={offerTypes[offerType]}
            onPress={onPress(offerType)}
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
