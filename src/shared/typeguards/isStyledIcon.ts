import { FunctionComponent } from 'react'

import { AccessibleIcon } from 'ui/svg/icons/types'

export function isStyledIcon(Icon: FunctionComponent<AccessibleIcon>): boolean {
  return typeof Icon === 'object'
}
