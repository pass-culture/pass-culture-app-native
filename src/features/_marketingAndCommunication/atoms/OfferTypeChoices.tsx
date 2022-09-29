import React, { useState } from 'react'
import styled from 'styled-components/native'

import { SelectionLabel } from 'features/search/atoms'
import { OFFER_TYPES } from 'features/search/sections/OfferType'
import { OfferTypes } from 'features/search/types'
import { Li } from 'ui/components/Li'
import { Ul } from 'ui/components/Ul'
import { getSpacing } from 'ui/theme'

interface Props {
  onChange: ({
    isDigital,
    isEvent,
    isThing,
  }: {
    isDigital: boolean
    isEvent: boolean
    isThing: boolean
  }) => void
}

export const OfferTypeChoices = (props: Props) => {
  const [offerTypes, setOfferTypes] = useState({
    isDigital: false,
    isEvent: false,
    isThing: false,
  })

  return (
    <BodyContainer>
      <StyledUl>
        {OFFER_TYPES.filter(({ type }) => type).map(({ type, label }) => (
          <Li key={label}>
            <SelectionLabel
              label={label}
              selected={offerTypes[type as OfferTypes]}
              onPress={() => {
                setOfferTypes((prevOfferTypes) => {
                  const nextOfferTypes = { ...prevOfferTypes }
                  nextOfferTypes[type as OfferTypes] = !nextOfferTypes[type as OfferTypes]
                  props.onChange(nextOfferTypes)
                  return nextOfferTypes
                })
              }}
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
