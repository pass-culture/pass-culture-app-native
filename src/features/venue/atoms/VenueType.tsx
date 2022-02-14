import { t } from '@lingui/macro'
import React from 'react'

import { VenueTypeCodeKey } from 'api/gen'
import { mapVenueTypeToIcon } from 'libs/parsers'

import { IconWithCaption } from './IconWithCaption'

interface Props {
  type: VenueTypeCodeKey | null
  label?: string
}

export const VenueType = ({ type, label }: Props) => {
  const Icon = mapVenueTypeToIcon(type)
  return <IconWithCaption Icon={Icon} caption={label || ''} accessibilityLabel={t`Type de lieu`} />
}
