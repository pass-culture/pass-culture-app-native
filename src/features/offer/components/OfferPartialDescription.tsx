import React from 'react'
import webStyled from 'styled-components'
import styled from 'styled-components/native'

import { highlightLinks } from 'libs/parsers/highlightLinks'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { Dd } from 'ui/web/list/Dd'

import { useOffer } from '../api/useOffer'
import { OfferSeeMore } from '../atoms/OfferSeeMore'
import { getContentFromOffer } from '../pages/OfferDescription'

import { useShouldDisplaySeeMoreButton } from './useShouldDisplaySeeMoreButton'

interface Props {
  id: number
  description?: string
}

export const OfferPartialDescription: React.FC<Props> = ({ id, description = '' }) => {
  const { data: offerResponse } = useOffer({ offerId: id })
  const { extraData = {}, image } = offerResponse || {}
  const contentOfferDescription = getContentFromOffer(extraData, description, image?.credit)

  const maxTheoricalDisplayedDescriptionLines = 8
  const { shouldDisplaySeeMoreButton, maxDisplayedDescriptionLines, setLinesDisplayed } =
    useShouldDisplaySeeMoreButton(maxTheoricalDisplayedDescriptionLines, contentOfferDescription)

  if (contentOfferDescription.length === 0) return null

  return (
    <DescriptionContainer>
      <Spacer.Column numberOfSpaces={4} />
      {!!description && (
        <React.Fragment>
          <TypoDescription
            testID="offerPartialDescriptionBody"
            numberOfLines={maxDisplayedDescriptionLines}
            onTextLayout={({ nativeEvent }) => {
              setLinesDisplayed(nativeEvent.lines.length)
            }}>
            {highlightLinks(description)}
          </TypoDescription>
          <Spacer.Column numberOfSpaces={2} />
        </React.Fragment>
      )}
      {!!shouldDisplaySeeMoreButton && (
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
const DescriptionContainer = webStyled(Dd)({
  alignItems: 'center',
  paddingRight: getSpacing(6),
  paddingLeft: getSpacing(6),
})
