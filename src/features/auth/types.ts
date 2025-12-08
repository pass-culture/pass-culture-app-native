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
          | 'DUPLICATE_GOOGLE_ACCOUNT'
          | 'SSO_ACCOUNT_DELETED'
          | 'SSO_ACCOUNT_ANONYMIZED'
          | 'SSO_EMAIL_NOT_VALIDATED'
        general: string[]
      }
    | {
        code: 'SSO_EMAIL_NOT_FOUND'
        accountCreationToken: string
        email: string
        general: string[]
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
  isSSOSubscription: boolean
  accessibilityLabelForNextStep?: string
  goToNextStep: (signupData: Partial<SignupData>) => void
  previousSignupData: Partial<SignupData>
  onSSOEmailNotFoundError: () => void
  onDefaultEmailSignup: () => void
}

export type PreValidationSignupLastStepProps = {
  isSSOSubscription: boolean
  accessibilityLabelForNextStep?: string
  signUp: (token: string, marketingEmailSubscription: boolean) => Promise<void>
  previousSignupData: Partial<SignupData>
}

export type LoginRequest = SigninRequest | GoogleSigninRequest
