import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { heroMarginTop } from 'ui/components/hero/useHeroDimensions'
import {
  OfferButtonPlaceholder,
  OfferContentBodyPlaceholder,
  OfferImagePlaceholder,
} from 'ui/components/placeholders/Placeholders'
import { getSpacing, Spacer } from 'ui/theme'

export const OfferContentPlaceholder: FunctionComponent = () => {
  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={heroMarginTop} />
      <OfferImagePlaceholderContainer>
        <OfferImagePlaceholder />
      </OfferImagePlaceholderContainer>
      <Spacer.Column numberOfSpaces={8} />
      <OfferContentBodyPlaceholder />
      <OfferButtonPlaceholderContainer>
        <OfferButtonPlaceholder />
      </OfferButtonPlaceholderContainer>
      <Spacer.Column numberOfSpaces={8} />
    </React.Fragment>
  )
}

const OfferImagePlaceholderContainer = styled.View({
  alignItems: 'center',
})

const OfferButtonPlaceholderContainer = styled.View({
  marginHorizontal: getSpacing(6),
})
