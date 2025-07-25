import { FunctionComponent, ReactElement } from 'react'

import { variantIcons } from 'ui/components/Tag/Tag.variants'
import { TagVariant } from 'ui/components/Tag/types'
import { AccessibleIcon } from 'ui/svg/icons/types'

export function getTagIcon(
  variant: TagVariant,
  icon?: FunctionComponent<AccessibleIcon> | ReactElement
): FunctionComponent<AccessibleIcon> | ReactElement {
  const forcedVariants = [
    TagVariant.BOOKCLUB,
    TagVariant.CINECLUB,
    TagVariant.HEADLINE,
    TagVariant.LIKE,
    TagVariant.COMING_SOON,
  ]
  return forcedVariants.includes(variant) ? variantIcons[variant] : icon
}
