import React, { useState } from 'react'
import { Platform } from 'react-native'
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

  const shouldDisplaySeeMoreButtonOnThisPlatform = Platform.OS !== 'web'
  const maxDisplayedDescriptionLines = shouldDisplaySeeMoreButtonOnThisPlatform ? 8 : undefined
  const [isLongerThanMaximumLines, setIsLongerThanMaximumLines] = useState(
    shouldDisplaySeeMoreButtonOnThisPlatform
  )
  const setLinesDisplayed = (linesDisplayed: number): void => {
    if (typeof maxDisplayedDescriptionLines === 'undefined') return

    setIsLongerThanMaximumLines(linesDisplayed >= maxDisplayedDescriptionLines)
  }
  const shouldDisplaySeeMoreButton = shouldDisplaySeeMoreButtonOnThisPlatform
    ? contentOfferDescription.length > 0 && isLongerThanMaximumLines
    : contentOfferDescription.filter(({ key }) => key !== 'description').length > 0

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
const DescriptionContainer = styled.View({
  alignItems: 'center',
  paddingHorizontal: getSpacing(6),
})
