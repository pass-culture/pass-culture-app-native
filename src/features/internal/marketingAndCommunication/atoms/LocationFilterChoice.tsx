import React from 'react'

import { LocationChoice } from 'features/search/components/LocationChoice'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { BicolorEverywhere as Everywhere } from 'ui/svg/icons/BicolorEverywhere'
import { Spacer } from 'ui/theme'

// The Location choice is always selected in the deeplink generator
// The marketing team has the habit to see the "Partout" selected, so we keep it hard selected

export const LocationFilterChoice = () => {
  return (
    <VerticalUl>
      <Li>
        <Spacer.Column numberOfSpaces={4} />
        <LocationChoice
          label="Partout"
          Icon={Everywhere}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onPress={() => {}}
          isSelected
        />
      </Li>
    </VerticalUl>
  )
}
