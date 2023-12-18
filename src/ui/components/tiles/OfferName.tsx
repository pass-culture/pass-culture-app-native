import React from 'react'
import styled from 'styled-components/native'

import { sanitizeTitle } from 'shared/offer/helpers/sanitizeTitle'
import { Typo } from 'ui/theme/typography'

export const OfferName = ({ title }: { title?: string }) => {
  const uiTitle = sanitizeTitle(title)
  if (!uiTitle) return null
  return <Name numberOfLines={2}>{uiTitle}</Name>
}
const Name = styled(Typo.ButtonText)``
