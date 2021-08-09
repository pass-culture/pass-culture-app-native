import React from 'react'

import { VenueTypeCode } from 'api/gen'
import { mapTypeToIcon } from 'libs/parsers'

import { IconWithCaption } from './IconWithCaption'

interface VenueTypeProps {
  type: VenueTypeCode | null | undefined
  label?: string
}

export const VenueType = ({ type, label }: VenueTypeProps) => {
  const Icon = mapTypeToIcon(type)
  return <IconWithCaption Icon={Icon} caption={label || ''} />
}
