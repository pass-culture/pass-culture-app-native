import React, { FunctionComponent, ReactElement, cloneElement } from 'react'

import { isReactElement } from 'shared/typeguards/isReactElement'
import { isStyledIcon } from 'shared/typeguards/isStyledIcon'
import { ColorsType } from 'theme/types'
import { AccessibleIcon } from 'ui/svg/icons/types'

export const renderTagIcon = (
  color: ColorsType,
  size: number,
  Icon?: FunctionComponent<AccessibleIcon> | ReactElement
) => {
  if (!Icon) return null

  const iconProps = {
    color,
    size,
    testID: 'tagIcon',
  }

  if (isReactElement(Icon)) {
    return cloneElement(Icon, iconProps)
  }
  if (isStyledIcon(Icon)) {
    return <Icon {...iconProps} />
  }

  return null
}
