import React from 'react'
import { Switch } from 'react-native'

import { ColorsEnum } from 'ui/theme'

interface Props {
  active: boolean
  toggle: () => void
}

export const FilterSwitch: React.FC<Props> = ({ active, toggle }) => (
  <Switch
    testID="filterSwitch"
    trackColor={trackColor}
    thumbColor={ColorsEnum.WHITE}
    ios_backgroundColor={ColorsEnum.GREY_MEDIUM}
    onValueChange={toggle}
    value={active}
  />
)

const trackColor = { false: ColorsEnum.GREY_MEDIUM, true: ColorsEnum.GREEN_VALID }
