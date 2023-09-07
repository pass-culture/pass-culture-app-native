import { Tutorial } from 'features/tutorial/enums'

const eligibleAgesList = [15, 16, 17, 18] as const
type EligibleAgesList = typeof eligibleAgesList
export type EligibleAges = EligibleAgesList[number]

export interface TutorialType {
  type: Tutorial.ONBOARDING | Tutorial.PROFILE_TUTORIAL
}
