import React, { useState } from 'react'
import { Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { highlightLinks } from 'libs/parsers/highlightLinks'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { useOffer } from '../api/useOffer'
import { OfferSeeMore } from '../atoms/OfferSeeMore'
import { getContentFromOffer } from '../pages/OfferDescription'

interface Props {
  id: number
  description?: string
}

export const useShouldDisplaySeeMoreButton = (
  maxTheoricalDisplayedDescriptionLines: number,
  contentOfferDescription: ReturnType<typeof getContentFromOffer>
): {
  shouldDisplaySeeMoreButton: boolean
  maxDisplayedDescriptionLines?: number
  setLinesDisplayed: (linesDisplayed: number) => void
} => {
  const theme = useTheme()
  const shouldTruncateDescription = !(Platform.OS === 'web' && theme.isDesktopViewport === true)
  const maxDisplayedDescriptionLines = shouldTruncateDescription
    ? maxTheoricalDisplayedDescriptionLines
    : undefined
  const [isLongerThanMaximumLines, setIsLongerThanMaximumLines] =
    useState(shouldTruncateDescription)
  const setLinesDisplayed = (linesDisplayed: number): void => {
    if (typeof maxDisplayedDescriptionLines === 'undefined') return

    setIsLongerThanMaximumLines(linesDisplayed >= maxDisplayedDescriptionLines)
  }
  const shouldDisplaySeeMoreButton = shouldTruncateDescription
    ? contentOfferDescription.length > 0 && isLongerThanMaximumLines
    : contentOfferDescription.filter(({ key }) => key !== 'description').length > 0

  return { shouldDisplaySeeMoreButton, maxDisplayedDescriptionLines, setLinesDisplayed }
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
const DescriptionContainer = styled.View({
  alignItems: 'center',
  paddingHorizontal: getSpacing(6),
})
