import React from 'react'

import { useMobileFontScaleToDisplay } from 'shared/accessibility/helpers/zoomHelpers'
import { sanitizeTitle } from 'shared/offer/helpers/sanitizeTitle'
import { Typo } from 'ui/theme/typography'

export const OfferName = ({ title }: { title: string }) => {
  const numberOfLines = useMobileFontScaleToDisplay({ default: 1, at200PercentZoom: undefined })
  const uiTitle = sanitizeTitle(title)
  if (!uiTitle) return null
  return <Typo.BodyAccent numberOfLines={numberOfLines}>{uiTitle}</Typo.BodyAccent>
}
