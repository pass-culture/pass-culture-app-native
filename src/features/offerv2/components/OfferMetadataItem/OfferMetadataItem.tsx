import React from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'

export type OfferMetadataItemProps = {
  label: string
  value: string
}

export function OfferMetadataItem({ label, value }: Readonly<OfferMetadataItemProps>) {
  return (
    <Container>
      <Typo.ButtonText>{label}&nbsp;: </Typo.ButtonText>
      <Typo.Body>{value}</Typo.Body>
    </Container>
  )
}

const Container = styled.View({
  display: 'inline-block',
})
