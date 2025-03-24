import React from 'react'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'

import { TouchableProps } from './types'

export const Touchable: React.FC<TouchableProps> = ({ accessibilityLabel, ...props }) => (
  <TouchableOpacity
    accessibilityRole={AccessibilityRole.BUTTON}
    accessibilityLabel={accessibilityLabel}
    {...props}
  />
)
