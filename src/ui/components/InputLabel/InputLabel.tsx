import React from 'react'

import { TypoDS } from 'ui/theme'

export const InputLabel = TypoDS.Body as React.FC<{
  id?: string
  accessibilityDescribedBy?: string
  htmlFor: string
  children: React.ReactNode
}>
