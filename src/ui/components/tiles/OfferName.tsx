import React from 'react'
import styled from 'styled-components/native'

import { sanitizeTitle } from 'shared/offer/helpers/sanitizeTitle'
import { TypoDS } from 'ui/theme/designSystemTypographie'

export const OfferName = ({ title }: { title: string }) => {
  const uiTitle = sanitizeTitle(title)
  if (!uiTitle) return null
  return (
    <Name numberOfLines={1} ellipsizeMode="tail">
      {uiTitle}
    </Name>
  )
}
const Name = styled(TypoDS.BodySemiBold)``
