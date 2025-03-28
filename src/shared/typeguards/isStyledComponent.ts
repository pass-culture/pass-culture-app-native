import { FunctionComponent } from 'react'

import { AccessibleIcon } from 'ui/svg/icons/types'

export function isStyledComponent(Icon: FunctionComponent<AccessibleIcon>): boolean {
  return typeof Icon === 'object' && 'styledComponentId' in Icon
}
