import { FunctionComponent } from 'react'

import { FILTERS_ACTIVITY_MAPPING } from 'features/venueMap/constant'
import { AccessibleIcon } from 'ui/svg/icons/types'

export type Size = { width: number; height: number }

export type FilterGroupKey = keyof typeof FILTERS_ACTIVITY_MAPPING

export type FilterGroupData = {
  id: FilterGroupKey
  label: string
  color: string
  icon: FunctionComponent<AccessibleIcon>
}
