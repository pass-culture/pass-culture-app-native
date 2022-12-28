import React from 'react'

import { TouchableOpacity } from 'ui/components/TouchableOpacity'

import { TouchableProps } from './types'

export const Touchable: React.FC<TouchableProps> = ({ accessibilityLabel, ...props }) => (
  <TouchableOpacity accessibilityRole="button" accessibilityLabel={accessibilityLabel} {...props} />
)
