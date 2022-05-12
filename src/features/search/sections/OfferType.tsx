import { t } from '@lingui/macro'
import React from 'react'
import { AccessibilityRole, Platform, View } from 'react-native'
import webStyled from 'styled-components'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

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
  const titleID = uuidv4()

  const onPress = (offerType: OfferType) => () => {
    dispatch({ type: 'OFFER_TYPE', payload: offerType })
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
      <BodyContainer aria-labelledby={titleID}>
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

const BodyContainer = styled(View).attrs({
  accessibilityRole: Platform.OS === 'web' ? ('group' as AccessibilityRole) : undefined,
})({
  flexWrap: 'wrap',
  flexDirection: 'row',
  marginBottom: getSpacing(-3),
  marginRight: getSpacing(-3),
})

const StyledUl = webStyled(Ul)({
  flexWrap: 'wrap',
})
