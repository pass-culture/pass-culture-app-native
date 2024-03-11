import React from 'react'
import styled from 'styled-components/native'

import {
  OfferMetadataItem,
  OfferMetadataItemProps,
} from 'features/offer/components/OfferMetadataItem/OfferMetadataItem'
import { getSpacing } from 'ui/theme'

type Props = {
  metadata: OfferMetadataItemProps[]
}

export function OfferMetadataList({ metadata }: Readonly<Props>) {
  return (
    <Container>
      {metadata.map((item) => (
        <OfferMetadataItem key={item.label} label={item.label} value={item.value} />
      ))}
    </Container>
  )
}

const Container = styled.View({
  gap: getSpacing(2),
})
