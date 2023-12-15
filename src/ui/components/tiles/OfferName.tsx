import React from 'react'
import styled from 'styled-components/native'

import sanitizeTitle from 'shared/offer/helpers/sanitizeTitle'
import { Typo } from 'ui/theme/typography'

const OfferName = ({ title }: { title?: string }) => {
  if (!title) return null
  const uiTitle = sanitizeTitle(title)
  return <Name numberOfLines={2}>{uiTitle}</Name>
}
const Name = styled(Typo.ButtonText)``
export default OfferName
