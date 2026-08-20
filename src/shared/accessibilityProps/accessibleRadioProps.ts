import { Platform } from 'react-native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'

export const accessibleRadioProps = ({
  checked,
  label,
  accessibilityLabel,
  tabIndex,
}: {
  checked?: boolean
  label?: string
  accessibilityLabel?: string
  tabIndex?: number
}) => {
  const commonProps = {
    accessibilityRole: AccessibilityRole.RADIO,
    accessibilityLabel: accessibilityLabel ?? label,
  }
  return Platform.select({
    web: {
      ...commonProps,
      accessibilityChecked: checked,
      tabIndex,
    },
    default: {
      ...commonProps,
      accessibilityState: { checked },
    },
  })
}
