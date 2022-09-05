import React, { useState } from 'react'

import { LocationChoice } from 'features/search/components/LocationChoice'
import { LocationType } from 'features/search/enums'
import { LocationFilter } from 'features/search/types'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { BicolorAroundMe as AroundMe } from 'ui/svg/icons/BicolorAroundMe'
import { BicolorEverywhere as Everywhere } from 'ui/svg/icons/BicolorEverywhere'
import { Spacer } from 'ui/theme'

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
          label={'Autour de moi'}
          Icon={AroundMe}
          onPress={onPressAroundMe}
          isSelected={LocationType.AROUND_ME === selected}
        />
      </Li>
      <Li>
        <Spacer.Column numberOfSpaces={4} />
        <LocationChoice
          testID="everywhere"
          label={'Partout'}
          Icon={Everywhere}
          onPress={onPressEverywhere}
          isSelected={LocationType.EVERYWHERE === selected}
        />
      </Li>
    </VerticalUl>
  )
}
