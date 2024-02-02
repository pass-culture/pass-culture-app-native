import { GoogleSigninRequest, SigninRequest } from 'api/gen'

export type SignInResponseFailure = {
  isSuccess: false
  statusCode?: number
  content?:
    | {
        code:
          | 'ACCOUNT_DELETED'
          | 'EMAIL_NOT_VALIDATED'
          | 'NETWORK_REQUEST_FAILED'
          | 'TOO_MANY_ATTEMPTS'
        general: string[]
      }
    | {
        code: 'SSO_EMAIL_NOT_FOUND'
        general: string[]
        accountCreationToken: string
      }
}

export type SignupData = {
  email: string
  marketingEmailSubscription: boolean
  password: string
  birthdate: string
  accountCreationToken?: string
}

export type PreValidationSignupNormalStepProps = {
  accessibilityLabelForNextStep?: string
  goToNextStep: (signupData: Partial<SignupData>) => void
  previousSignupData: Partial<SignupData>
  onSSOEmailNotFoundError: () => void
  onDefaultEmailSignup: () => void
}

export type PreValidationSignupLastStepProps = {
  accessibilityLabelForNextStep?: string
  signUp: (token: string) => Promise<void>
  previousSignupData: Partial<SignupData>
}

export type LoginRequest = SigninRequest | GoogleSigninRequest
