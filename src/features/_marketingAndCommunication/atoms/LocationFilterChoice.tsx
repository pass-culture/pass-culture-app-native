import React, { useState } from 'react'

import { LocationChoice } from 'features/search/components/LocationChoice'
import { LocationType } from 'features/search/enums'
import { LocationFilter } from 'features/search/types'
import { Spacer } from 'ui/theme'
import { Li } from 'ui/web/list/Li'
import { VerticalUl } from 'ui/web/list/Ul'

interface Props {
  onChange: (locationFilter: LocationFilter) => void
}

export const LocationFilterChoice = (props: Props) => {
  const [selected, setSelected] = useState<LocationType>(LocationType.EVERYWHERE)

  const onPressAroundMe = async () => {
    setSelected(LocationType.AROUND_ME)
    props.onChange({ locationType: LocationType.AROUND_ME, aroundRadius: 100 })
  }

  const onPressEverywhere = () => {
    setSelected(LocationType.EVERYWHERE)
    props.onChange({ locationType: LocationType.EVERYWHERE })
  }

  return (
    <VerticalUl>
      <Li>
        <Spacer.Column numberOfSpaces={4} />
        <LocationChoice
          testID="aroundMe"
          section={LocationType.AROUND_ME}
          onPress={onPressAroundMe}
          isSelected={LocationType.AROUND_ME === selected}
        />
      </Li>
      <Li>
        <Spacer.Column numberOfSpaces={4} />
        <LocationChoice
          testID="everywhere"
          section={LocationType.EVERYWHERE}
          onPress={onPressEverywhere}
          isSelected={LocationType.EVERYWHERE === selected}
        />
      </Li>
    </VerticalUl>
  )
}
