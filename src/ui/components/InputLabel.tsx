import React from 'react'

import { Typo } from 'ui/theme'

export const InputLabel = ({
  children,
}: {
  id?: string
  htmlFor: string
  children: React.ReactNode
}) => <Typo.Body>{children}</Typo.Body>
