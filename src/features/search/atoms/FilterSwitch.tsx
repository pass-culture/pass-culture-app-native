import React, { useState } from 'react'
import { Switch } from 'react-native'

import { ColorsEnum } from 'ui/theme'

export const FilterSwitch: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false)
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState)

  const trackColor = { false: ColorsEnum.GREY_MEDIUM, true: ColorsEnum.GREEN_VALID }

  return (
    <Switch
      trackColor={trackColor}
      thumbColor={ColorsEnum.WHITE}
      ios_backgroundColor={ColorsEnum.GREY_MEDIUM}
      onValueChange={toggleSwitch}
      value={isEnabled}
    />
  )
}
