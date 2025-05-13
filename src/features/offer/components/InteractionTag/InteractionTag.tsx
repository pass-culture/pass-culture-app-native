import React, { FunctionComponent } from 'react'

import { ColorsTypeLegacy } from 'theme/types'
import { Tag } from 'ui/components/Tag/Tag'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing } from 'ui/theme'

export type InteractionTagProps = {
  label: string
  backgroundColor?: ColorsTypeLegacy
  Icon?: React.FunctionComponent<AccessibleIcon>
}

export const InteractionTag: FunctionComponent<InteractionTagProps> = ({
  label,
  backgroundColor,
  Icon,
}) => {
  return (
    <Tag
      testID="interaction-tag"
      label={label}
      backgroundColor={backgroundColor}
      Icon={Icon}
      paddingHorizontal={getSpacing(1)}
    />
  )
}
