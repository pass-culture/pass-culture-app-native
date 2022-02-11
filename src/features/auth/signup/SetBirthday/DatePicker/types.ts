import { SignupData } from 'features/auth/signup/types'

export interface DatePickerProps {
  accessibilityLabelForNextStep?: string
  goToNextStep: (signupData: Partial<SignupData>) => void
  chidren?: never
}
