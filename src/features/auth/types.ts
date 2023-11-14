import { GoogleSigninRequest, SigninRequest } from 'api/gen'

export type SignInResponseFailure = {
  isSuccess: false
  statusCode?: number
  content?: {
    code: 'ACCOUNT_DELETED' | 'EMAIL_NOT_VALIDATED' | 'NETWORK_REQUEST_FAILED' | 'TOO_MANY_ATTEMPTS'
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

export type PreValidationSignupNormalStepProps = {
  accessibilityLabelForNextStep?: string
  goToNextStep: (signupData: Partial<SignupData>) => void
  previousSignupData: Partial<SignupData>
}

export type PreValidationSignupLastStepProps = {
  accessibilityLabelForNextStep?: string
  signUp: (token: string) => Promise<void>
  previousSignupData: Partial<SignupData>
}

export type LoginRequest = SigninRequest | GoogleSigninRequest
