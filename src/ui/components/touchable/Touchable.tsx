import React from 'react'

import { accessibilityRoleInternalNavigation } from 'shared/accessibility/accessibilityRoleInternalNavigation'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'

import { TouchableProps } from './types'

export const Touchable: React.FC<TouchableProps> = ({
  accessibilityLabel,
  accessibilityRole,
  ...props
}) => (
  <TouchableOpacity
    accessibilityRole={accessibilityRole ?? accessibilityRoleInternalNavigation()}
    accessibilityLabel={accessibilityLabel}
    {...props}
  />
)
