import React from 'react'
import { Text } from 'react-native'

import { Typo } from 'ui/theme'

export type OfferMetadataItemProps = {
  label: string
  value: string
}

export function OfferMetadataItem({ label, value }: Readonly<OfferMetadataItemProps>) {
  return (
    <Text>
      <Typo.ButtonText>{label}&nbsp;: </Typo.ButtonText>
      <Typo.Body>{value}</Typo.Body>
    </Text>
  )
}
