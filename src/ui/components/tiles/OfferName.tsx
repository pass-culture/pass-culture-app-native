import React from 'react'

import { sanitizeTitle } from 'shared/offer/helpers/sanitizeTitle'
import { TypoDS } from 'ui/theme/designSystemTypographie'

export const OfferName = ({ title }: { title: string }) => {
  const uiTitle = sanitizeTitle(title)
  if (!uiTitle) return null
  return <TypoDS.BodyAccent numberOfLines={1}>{uiTitle}</TypoDS.BodyAccent>
}
