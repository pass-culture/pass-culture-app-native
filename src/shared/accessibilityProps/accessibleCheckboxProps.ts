import { Platform } from 'react-native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'

export const accessibleCheckboxProps = ({
  checked,
  label,
}: {
  checked?: boolean
  label?: string
}) => {
  const commonProps = { accessibilityRole: AccessibilityRole.CHECKBOX, accessibilityLabel: label }
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
