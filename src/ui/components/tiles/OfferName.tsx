import React from 'react'

import { useNumberOfLine } from 'shared/accessibility/helpers/zoomHelpers'
import { sanitizeTitle } from 'shared/offer/helpers/sanitizeTitle'
import { Typo } from 'ui/theme/typography'

export const OfferName = ({ title }: { title: string }) => {
  const numberOfLines = useNumberOfLine(1)
  const uiTitle = sanitizeTitle(title)
  if (!uiTitle) return null
  return <Typo.BodyAccent numberOfLines={numberOfLines}>{uiTitle}</Typo.BodyAccent>
}
