import React from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { SelectionLabel, TitleWithCount } from 'features/search/atoms'
import { OfferType as OfferTypeEnum } from 'features/search/enums'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { OfferTypes } from 'features/search/types'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { AccordionItem } from 'ui/components/AccordionItem'
import { Li } from 'ui/components/Li'
import { Ul } from 'ui/components/Ul'
import { Numeric } from 'ui/svg/icons/bicolor/Numeric'
import { Show } from 'ui/svg/icons/bicolor/Show'
import { Thing } from 'ui/svg/icons/bicolor/Thing'
import { BicolorLogo } from 'ui/svg/icons/BicolorLogo'
import { AccessibleBicolorIconInterface } from 'ui/svg/icons/types'
import { getSpacing } from 'ui/theme'

export const OFFER_TYPES: Array<{
  type?: OfferTypes
  icon: React.FC<AccessibleBicolorIconInterface>
  label: OfferTypeEnum
}> = [
  { label: OfferTypeEnum.ALL_TYPE, icon: BicolorLogo },
  { type: 'isDigital', label: OfferTypeEnum.DIGITAL, icon: Numeric },
  { type: 'isEvent', label: OfferTypeEnum.EVENT, icon: Show },
  { type: 'isThing', label: OfferTypeEnum.THING, icon: Thing },
]

export const OfferType: React.FC = () => {
  const logUseFilter = useLogFilterOnce(SectionTitle.OfferType)
  const { searchState, dispatch } = useStagedSearch()
  const { offerTypes } = searchState
  const titleID = uuidv4()

  const onPress = (offerType: OfferTypes) => () => {
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
      <BodyContainer aria-labelledby={titleID} accessibilityRole={AccessibilityRole.GROUP}>
        <StyledUl>
          {OFFER_TYPES.filter(({ type }) => type).map(({ type, label }) => (
            <Li key={label}>
              <SelectionLabel
                label={label}
                selected={offerTypes[type as OfferTypes]}
                onPress={onPress(type as OfferTypes)}
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
