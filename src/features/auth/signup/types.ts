export type SignupData = {
  email: string
  marketingEmailSubscription: boolean
  password: string
  birthdate: string
  postalCode: string
}

export interface PreValidationSignupStepProps {
  accessibilityLabelForNextStep?: string
  goToNextStep: (signupData: Partial<SignupData>) => void
  signUp: (token: string) => Promise<void>
}
