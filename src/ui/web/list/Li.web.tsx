import React from 'react'

import { LiProps } from 'ui/web/list/Li'

export function Li({ children, className }: LiProps) {
  return <li className={className}>{children}</li>
}
