import { useState } from 'react'
import { Platform } from 'react-native'
import { useTheme } from 'styled-components/native'

import { getContentFromOffer } from '../pages/OfferDescription'

export const useShouldDisplaySeeMoreButton = (
  maxTheoricalDisplayedDescriptionLines: number,
  contentOfferDescription: ReturnType<typeof getContentFromOffer>
): {
  shouldDisplaySeeMoreButton: boolean
  maxDisplayedDescriptionLines?: number
  setLinesDisplayed: (linesDisplayed: number) => void
} => {
  const theme = useTheme()
  const shouldTruncateDescription = !(Platform.OS === 'web' && theme.isDesktopViewport)
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
  const shouldDisplaySeeMoreButton = shouldTruncateDescription
    ? contentOfferDescription.length > 0 && isLongerThanMaximumLines
    : contentOfferDescription.filter(({ key }) => key !== 'description').length > 0

  return { shouldDisplaySeeMoreButton, maxDisplayedDescriptionLines, setLinesDisplayed }
}
