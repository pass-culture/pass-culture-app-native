import React from 'react'

import { mapVenueTypeToIcon, VenueTypeCode } from 'libs/parsers'

import { IconWithCaption } from './IconWithCaption'

interface Props {
  type: VenueTypeCode | null
  label?: string
}

export const VenueType = ({ type, label }: Props) => {
  const Icon = mapVenueTypeToIcon(type)
  return <IconWithCaption Icon={Icon} caption={label || ''} accessibilityLabel={'Type de lieu'} />
}
