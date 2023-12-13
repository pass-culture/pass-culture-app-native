import React from 'react'
import styled from 'styled-components/native'

import { sanitizeOfferName } from 'shared/offer/helpers/sanitizeOfferName'
import { Typo } from 'ui/theme/typography'

const OfferName = ({ title }: { title?: string }) => {
  const uiTitle = sanitizeOfferName(title ?? '')
  return <Name numberOfLines={2}>{uiTitle}</Name>
}
const Name = styled(Typo.ButtonText)``
export default OfferName
