import React from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme/typography'

const OfferName = ({ title }: { title?: string }) => {
  const cleanedTitle = title?.trim() ?? ''
  const uiTitle = cleanedTitle[0].toUpperCase() + cleanedTitle.slice(1)
  return <Name numberOfLines={2}>{uiTitle}</Name>
}
const Name = styled(Typo.ButtonText)``
export default OfferName
