import { useState } from 'react'
import { useTheme } from 'styled-components/native'

import { getContentFromOffer } from 'features/offer/pages/OfferDescription/OfferDescription'

export const useShouldDisplaySeeMoreButton = (
  maxTheoricalDisplayedDescriptionLines: number,
  contentOfferDescription: ReturnType<typeof getContentFromOffer>
): {
  shouldDisplaySeeMoreButton: boolean
  maxDisplayedDescriptionLines?: number
  setLinesDisplayed: (linesDisplayed: number) => void
} => {
  const theme = useTheme()
  const shouldTruncateDescription = theme.isDesktopViewport === false
  const maxDisplayedDescriptionLines = shouldTruncateDescription
    ? maxTheoricalDisplayedDescriptionLines
    : undefined
  const [isLongerThanMaximumLines, setIsLongerThanMaximumLines] =
    useState(shouldTruncateDescription)
  const setLinesDisplayed = (linesDisplayed: number): void => {
    if (typeof maxDisplayedDescriptionLines !== 'undefined') {
      setIsLongerThanMaximumLines(linesDisplayed >= maxDisplayedDescriptionLines)
    }
  }
  const hasDataToDisplayOnDescriptionPage =
    contentOfferDescription.filter(({ key }) => key !== 'description').length > 0
  const shouldDisplaySeeMoreButton =
    hasDataToDisplayOnDescriptionPage || (shouldTruncateDescription && isLongerThanMaximumLines)

  return { shouldDisplaySeeMoreButton, maxDisplayedDescriptionLines, setLinesDisplayed }
}
