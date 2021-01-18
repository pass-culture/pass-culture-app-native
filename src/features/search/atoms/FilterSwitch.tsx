import React from 'react'
import { Switch } from 'react-native'

import { _ } from 'libs/i18n'
import { ColorsEnum } from 'ui/theme'

import { useFilterSwitch } from './useFilterSwitch'

export const FilterSwitch: React.FC = () => {
  const { isEnabled, toggleSwitch } = useFilterSwitch()
  return (
    <React.Fragment>
      <Switch
        trackColor={{ false: ColorsEnum.GREY_MEDIUM, true: ColorsEnum.GREEN_VALID }}
        thumbColor={ColorsEnum.WHITE}
        ios_backgroundColor={ColorsEnum.GREY_MEDIUM}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </React.Fragment>
  )
}
