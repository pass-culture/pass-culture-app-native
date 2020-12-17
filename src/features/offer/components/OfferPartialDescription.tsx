import React from 'react'
import styled from 'styled-components/native'

import { highlightLinks } from 'libs/parsers/highlightLinks'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { OfferSeeMore } from '../atoms/OfferSeeMore'

interface Props {
  id: string
  description?: string
}

export const OfferPartialDescription: React.FC<Props> = ({ id, description = '' }) => (
  <DescriptionContainer>
    {!!description && (
      <React.Fragment>
        <TypoDescription testID="offerPartialDescriptionBody" numberOfLines={8}>
          {highlightLinks(description)}
        </TypoDescription>
        <Spacer.Column numberOfSpaces={2} />
      </React.Fragment>
    )}
    <OfferSeeMoreContainer testID="offerSeeMoreContainer" description={description}>
      <OfferSeeMore id={id} longWording={!description} />
    </OfferSeeMoreContainer>
  </DescriptionContainer>
)

const OfferSeeMoreContainer = styled.View<{ description: string }>(({ description }) => ({
  alignSelf: description ? 'flex-end' : 'center',
}))
const TypoDescription = styled(Typo.Body)({ overflow: 'hidden' })
const DescriptionContainer = styled.View({
  alignItems: 'center',
  paddingHorizontal: getSpacing(6),
})
