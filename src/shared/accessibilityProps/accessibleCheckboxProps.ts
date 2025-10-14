import { Platform } from 'react-native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'

export const accessibleCheckboxProps = ({
  checked,
  label,
  required,
}: {
  checked?: boolean
  label?: string
  required?: boolean
}) => {
  const computedLabel = required && label ? `${label} - obligatoire` : label
  const commonProps = {
    accessibilityRole: AccessibilityRole.CHECKBOX,
    accessibilityLabel: computedLabel,
  }

  return Platform.select({
    web: {
      ...commonProps,
      accessibilityChecked: checked,
      accessibilityRequired: required,
    },
    default: {
      ...commonProps,
      accessibilityState: { checked },
    },
  })
}
