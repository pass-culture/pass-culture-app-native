import { ReactElement } from 'react'

import { TutorialTypes } from 'features/tutorial/enums'
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

export interface TutorialType {
  type: TutorialTypes.ONBOARDING | TutorialTypes.PROFILE_TUTORIAL
}
