import React from 'react'

export const HiddenCheckbox = ({
  checked,
  id,
  name,
  accessibilityLabel,
  onChange,
}: {
  checked: boolean
  id?: string
  name: string
  accessibilityLabel: string
  onChange: () => void
}) => (
  <input
    type="checkbox"
    id={id}
    name={name}
    checked={checked}
    aria-label={accessibilityLabel}
    onChange={onChange}
    hidden
    readOnly
  />
)
