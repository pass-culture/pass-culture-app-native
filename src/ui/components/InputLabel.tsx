import React from 'react'

import { Typo } from 'ui/theme'

export const InputLabel = ({ children }: { htmlFor: string; children: React.ReactNode }) => (
  <Typo.Body>{children}</Typo.Body>
)
