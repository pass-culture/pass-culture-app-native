import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { SelectionLabel, TitleWithCount } from 'features/search/atoms'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { SearchState } from 'features/search/types'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { AccordionItem } from 'ui/components/AccordionItem'
import { Li } from 'ui/components/Li'
import { Ul } from 'ui/components/Ul'
import { getSpacing } from 'ui/theme'

type OfferTypes = keyof SearchState['offerTypes']

export const OFFER_TYPES: Array<[OfferTypes, string]> = [
  ['isDigital', t`Offre numérique`],
  ['isEvent', t`Sortie`],
  ['isThing', t`Offre physique`],
]

export const OfferType: React.FC = () => {
  const logUseFilter = useLogFilterOnce(SectionTitle.OfferType)
  const { searchState/*, dispatch*/ } = useStagedSearch()
  const { offerTypes } = searchState
  const titleID = uuidv4()

  const onPress = (offerType: OfferTypes) => () => {
    // dispatch({ type: 'OFFER_TYPE', payload: offerType })
    logUseFilter()
  }

  return (
    <AccordionItem
      defaultOpen={true}
      title={
        <TitleWithCount
          titleID={titleID}
          title={SectionTitle.OfferType}
          count={+offerTypes['isDigital'] + +offerTypes['isEvent'] + +offerTypes['isThing']}
          ariaLive="polite"
        />
      }
      accessibilityTitle={SectionTitle.OfferType}>
      <BodyContainer aria-labelledby={titleID} accessibilityRole={AccessibilityRole.GROUP}>
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

const StyledUl = styled(Ul)({
  flexWrap: 'wrap',
})
