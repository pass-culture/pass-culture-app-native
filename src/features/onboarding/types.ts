import { ReactElement } from 'react'

import { InternalNavigationProps } from 'ui/components/touchableLink/types'

export type EligibleAges = 15 | 16 | 17 | 18

export interface AgeButtonProps {
  accessibilityLabel: string
  dense?: boolean
  enableNavigate?: boolean
  Icon?: ReactElement
  navigateTo: InternalNavigationProps['navigateTo']
  onBeforeNavigate?: () => void
  children: React.ReactNode
}
