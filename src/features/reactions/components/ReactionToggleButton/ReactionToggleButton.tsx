import React, { FunctionComponent } from 'react'

import { ToggleButton } from 'ui/components/buttons/ToggleButton'
import { AccessibleIcon } from 'ui/svg/icons/types'

type Props = {
  active: boolean
  label: string
  Icon: FunctionComponent<AccessibleIcon>
  FilledIcon: FunctionComponent<AccessibleIcon>
  onPress: VoidFunction
}

export const ReactionToggleButton: FunctionComponent<Props> = ({
  active,
  label,
  Icon,
  FilledIcon,
  onPress,
}) => {
  return (
    <ToggleButton
      active={active}
      onPress={onPress}
      label={{ active: label, inactive: label }}
      accessibilityLabel={{ active: label, inactive: label }}
      Icon={{ active: FilledIcon, inactive: Icon }}
      isFlex
    />
  )
}
