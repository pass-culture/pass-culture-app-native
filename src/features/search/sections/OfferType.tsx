import { t } from '@lingui/macro'
import React from 'react'
import webStyled from 'styled-components'
import styled from 'styled-components/native'

import { SelectionLabel, TitleWithCount } from 'features/search/atoms'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { SearchState } from 'features/search/types'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { AccordionItem } from 'ui/components/AccordionItem'
import { getSpacing } from 'ui/theme'
import { Li } from 'ui/web/list/Li'
import { Ul } from 'ui/web/list/Ul'

type OfferType = keyof SearchState['offerTypes']

export const OFFER_TYPES: Array<[OfferType, string]> = [
  ['isDigital', t`Offre numérique`],
  ['isEvent', t`Sortie`],
  ['isThing', t`Offre physique`],
]

export const OfferType: React.FC = () => {
  const logUseFilter = useLogFilterOnce(SectionTitle.OfferType)
  const { searchState, dispatch } = useStagedSearch()
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
        <StyledUl>
          {OFFER_TYPES.map(([offerType, label]) => (
            <Li key={label}>
              <SelectionLabel
                label={label}
                selected={offerTypes[offerType]}
                onPress={onPress(offerType)}
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
