import React from 'react'

export const HiddenCheckbox = ({
  checked,
  accessibilityLabel,
}: {
  checked: boolean
  accessibilityLabel: string
}) => <input type="checkbox" checked={checked} aria-label={accessibilityLabel} hidden readOnly />
