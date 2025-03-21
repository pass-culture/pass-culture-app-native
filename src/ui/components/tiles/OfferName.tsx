import React from 'react'

import { sanitizeTitle } from 'shared/offer/helpers/sanitizeTitle'
import { Typo } from 'ui/theme/typography'

export const OfferName = ({ title }: { title: string }) => {
  const uiTitle = sanitizeTitle(title)
  if (!uiTitle) return null
  return <Typo.BodyAccent numberOfLines={1}>{uiTitle}</Typo.BodyAccent>
}
