import React from 'react'

import { TouchableOpacity } from 'ui/components/TouchableOpacity'

import { TouchableProps } from './types'

export const Touchable: React.FC<TouchableProps> = ({
  children,
  onPress,
  accessibilityLabel,
  testID,
  ...props
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      {...props}>
      {children}
    </TouchableOpacity>
  )
}
