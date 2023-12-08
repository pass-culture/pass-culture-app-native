import React, { useCallback, useState } from 'react'

import { LocationChoice } from 'features/search/components/LocationChoice'
import { LocationFilter } from 'features/search/types'
import { LocationMode } from 'libs/location/types'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { BicolorEverywhere as Everywhere } from 'ui/svg/icons/BicolorEverywhere'
import { Spacer } from 'ui/theme'

interface Props {
  onChange: (locationFilter: LocationFilter) => void
}

export const LocationFilterChoice = ({ onChange }: Props) => {
  const [selected, setSelected] = useState<LocationMode>(LocationMode.EVERYWHERE)

  const onPressEverywhere = useCallback(() => {
    setSelected(LocationMode.EVERYWHERE)
    onChange({ locationType: LocationMode.EVERYWHERE })
  }, [onChange])

  return (
    <VerticalUl>
      <Li>
        <Spacer.Column numberOfSpaces={4} />
        <LocationChoice
          label="Partout"
          Icon={Everywhere}
          onPress={onPressEverywhere}
          isSelected={LocationMode.EVERYWHERE === selected}
        />
      </Li>
    </VerticalUl>
  )
}
