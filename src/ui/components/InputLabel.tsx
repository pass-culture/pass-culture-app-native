import React from 'react'

import { Typo } from 'ui/theme'

export const InputLabel = ({ children }: { htmlFor: string; children: string }) => (
  <Typo.Body>{children}</Typo.Body>
)
