import React from 'react'
import { Text } from 'react-native'

import { TypoDS } from 'ui/theme'

export type OfferMetadataItemProps = {
  label: string
  value: string
}

export function OfferMetadataItem({ label, value }: Readonly<OfferMetadataItemProps>) {
  return (
    <Text>
      <TypoDS.BodyAccent>{label}&nbsp;: </TypoDS.BodyAccent>
      <TypoDS.Body>{value}</TypoDS.Body>
    </Text>
  )
}
