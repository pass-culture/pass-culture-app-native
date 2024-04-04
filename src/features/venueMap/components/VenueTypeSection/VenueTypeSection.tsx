import React, { FunctionComponent } from 'react'

import { VenueTypeMapping } from 'features/venueMap/types'
import { VenueTypeCode } from 'libs/parsers/venueType'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { Spacer, Typo } from 'ui/theme'

type Props = {
  venueTypeSelected: string | null
  venueTypeMapping: VenueTypeMapping
  onSelect: (venueTypeCode: VenueTypeCode) => void
}

export const VenueTypeSection: FunctionComponent<Props> = ({
  venueTypeSelected,
  venueTypeMapping,
  onSelect,
}) => {
  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Title1>{venueTypeMapping.title}</Typo.Title1>
      <Spacer.Column numberOfSpaces={6} />
      {Object.entries(venueTypeMapping.children).map(([venueTypeCode, label]) => (
        <React.Fragment key={venueTypeCode}>
          <RadioButton
            label={label}
            isSelected={venueTypeSelected === label}
            onSelect={() => onSelect(venueTypeCode as VenueTypeCode)}
          />
          <Spacer.Column numberOfSpaces={6} />
        </React.Fragment>
      ))}
    </React.Fragment>
  )
}
