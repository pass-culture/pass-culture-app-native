import React from 'react'

import { Typo } from 'ui/theme'

export const InputLabel = Typo.Body as React.FC<{
  id?: string
  accessibilityDescribedBy?: string
  accessibilityLabel?: string
  htmlFor: string
  children: React.ReactNode
}>
