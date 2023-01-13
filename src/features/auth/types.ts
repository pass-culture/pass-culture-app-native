export type SignInResponseFailure = {
  isSuccess: false
  statusCode?: number
  content?: {
    code: 'ACCOUNT_DELETED' | 'EMAIL_NOT_VALIDATED' | 'NETWORK_REQUEST_FAILED'
    general: string[]
  }
}

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
