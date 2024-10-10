import React, { FunctionComponent } from 'react'

import { VenuesCountByType, VenueTypeMapping } from 'features/venueMap/types'
import { VenueTypeCode } from 'libs/parsers/venueType'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { Spacer, TypoDS } from 'ui/theme'

type Props = {
  venueTypeSelected: string | null
  venueTypeMapping: VenueTypeMapping
  onSelect: (venueTypeCode: VenueTypeCode) => void
  venueCountByTypes?: Partial<VenuesCountByType>
}

export const VenueTypeSection: FunctionComponent<Props> = ({
  venueTypeSelected,
  venueTypeMapping,
  onSelect,
  venueCountByTypes,
}) => {
  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={3} />
      <TypoDS.Title1>{venueTypeMapping.title}</TypoDS.Title1>
      <Spacer.Column numberOfSpaces={3} />
      {Object.keys(venueTypeMapping.children).map((venueTypeCode) => {
        const label = venueTypeMapping.children[venueTypeCode as VenueTypeCode] ?? ''
        const isSelected = venueTypeSelected === label
        const complement = venueCountByTypes?.[venueTypeCode as VenueTypeCode] ?? 0

        return (
          <React.Fragment key={venueTypeCode}>
            <RadioButton
              label={label}
              isSelected={isSelected}
              onSelect={() => onSelect(venueTypeCode as VenueTypeCode)}
              complement={String(complement)}
            />
          </React.Fragment>
        )
      })}
    </React.Fragment>
  )
}
