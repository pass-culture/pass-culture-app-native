import React, { PropsWithChildren } from 'react'
import { View } from 'react-native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'

export const Main: React.FC<PropsWithChildren> = ({ children }) => {
  return <View accessibilityRole={AccessibilityRole.MAIN}>{children}</View>
}
