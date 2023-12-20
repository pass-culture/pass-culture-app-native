import React from 'react'

import {
  OfferMetadataItem,
  OfferMetadataItemProps,
} from 'features/offerv2/components/OfferMetadataItem/OfferMetadataItem'
import { Spacer } from 'ui/theme'

type Props = {
  metadata: OfferMetadataItemProps[]
}

export function OfferMetadataList({ metadata }: Readonly<Props>) {
  return (
    <React.Fragment>
      {metadata.map((item, index) => (
        <React.Fragment key={item.label}>
          <OfferMetadataItem label={item.label} value={item.value} />
          {index < metadata.length - 1 ? <Spacer.Column numberOfSpaces={2} /> : null}
        </React.Fragment>
      ))}
    </React.Fragment>
  )
}
