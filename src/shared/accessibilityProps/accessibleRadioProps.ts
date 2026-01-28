import { Platform } from 'react-native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'

export const accessibleRadioProps = ({
  checked,
  label,
  accessibilityLabel,
}: {
  checked?: boolean
  label?: string
  accessibilityLabel?: string
}) => {
  const commonProps = {
    accessibilityRole: AccessibilityRole.RADIO,
    accessibilityLabel: accessibilityLabel ?? label,
  }
  return Platform.select({
    web: {
      ...commonProps,
      accessibilityChecked: checked,
    },
    default: {
      ...commonProps,
      accessibilityState: { checked },
    },
  })
}
