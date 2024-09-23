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
      <TypoDS.BodySemiBold>{label}&nbsp;: </TypoDS.BodySemiBold>
      <TypoDS.Body>{value}</TypoDS.Body>
    </Text>
  )
}
