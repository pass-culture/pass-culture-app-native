import React from 'react'
import styled from 'styled-components/native'

import { highlightLinks } from 'libs/parsers/highlightLinks'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { useOffer } from '../api/useOffer'
import { OfferSeeMore } from '../atoms/OfferSeeMore'
import { getContentFromOffer } from '../pages/OfferDescription'

interface Props {
  id: number
  description?: string
}

export const OfferPartialDescription: React.FC<Props> = ({ id, description = '' }) => {
  const { data: offerResponse } = useOffer({ offerId: id })
  const { extraData = {}, image } = offerResponse || {}
  const contentOfferDescription = getContentFromOffer(extraData, description, image?.credit)

  if (contentOfferDescription.length === 0) return null

  return (
    <DescriptionContainer>
      <Spacer.Column numberOfSpaces={4} />
      {!!description && (
        <React.Fragment>
          <TypoDescription testID="offerPartialDescriptionBody" numberOfLines={8}>
            {highlightLinks(description)}
          </TypoDescription>
          <Spacer.Column numberOfSpaces={2} />
        </React.Fragment>
      )}
      {contentOfferDescription.length > 0 && (
        <OfferSeeMoreContainer testID="offerSeeMoreContainer" description={description}>
          <OfferSeeMore id={id} longWording={!description} />
        </OfferSeeMoreContainer>
      )}
    </DescriptionContainer>
  )
}

const OfferSeeMoreContainer = styled.View<{ description: string }>(({ description }) => ({
  alignSelf: description ? 'flex-end' : 'center',
}))
const TypoDescription = styled(Typo.Body)({ overflow: 'hidden', width: '100%' })
const DescriptionContainer = styled.View({
  alignItems: 'center',
  paddingHorizontal: getSpacing(6),
})
