import React from 'react'

import { VenueTypeCode } from 'api/gen'
import { mapTypeToIcon } from 'libs/parsers'

import { IconWithCaption } from './IconWithCaption'

interface Props {
  type: VenueTypeCode | null
  label?: string
}

export const VenueType = ({ type, label }: Props) => {
  const Icon = mapTypeToIcon(type)
  return <IconWithCaption Icon={Icon} caption={label || ''} />
}
