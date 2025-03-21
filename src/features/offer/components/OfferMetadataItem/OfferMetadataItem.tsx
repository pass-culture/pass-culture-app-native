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
      {label ? (
        <React.Fragment>
          <Typo.BodyAccent>{label}&nbsp;: </Typo.BodyAccent>

          <Typo.Body>{value}</Typo.Body>
        </React.Fragment>
      ) : (
        <Typo.BodyAccent>{value}</Typo.BodyAccent>
      )}
    </Text>
  )
}
