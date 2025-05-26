import { ReactElement } from 'react'

import { InternalNavigationProps } from 'ui/components/touchableLink/types'

const eligibleAgesList = [15, 16, 17, 18] as const
type EligibleAgesList = typeof eligibleAgesList
export type EligibleAges = EligibleAgesList[number]

export interface AgeButtonProps {
  accessibilityLabel: string
  dense?: boolean
  enableNavigate?: boolean
  Icon?: ReactElement
  navigateTo: InternalNavigationProps['navigateTo']
  onBeforeNavigate?: () => void
  children: React.ReactNode
}
