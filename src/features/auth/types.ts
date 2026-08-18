import React from 'react'

import { OAuthSigninRequestV2, SigninRequest } from 'api/gen'
import { AccessibleIcon } from 'ui/svg/icons/types'

export enum Provider {
  GOOGLE = 'google',
  APPLE = 'apple',
  EMAIL = 'email',
}

export type SignInResponseFailure = {
  isSuccess: false
  statusCode?: number
  provider?: Provider.GOOGLE | Provider.APPLE
  content?:
    | {
        code:
          | 'ACCOUNT_DELETED'
          | 'EMAIL_NOT_VALIDATED'
          | 'NETWORK_REQUEST_FAILED'
          | 'TOO_MANY_ATTEMPTS'
          | 'SSO_ERROR'
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
  ssoProvider?: Provider.GOOGLE | Provider.APPLE
}

export type PreValidationSignupNormalStepProps = {
  isSSOSubscription: boolean
  accessibilityLabelForNextStep?: string
  goToNextStep: (signupData: Partial<SignupData>) => void
  previousSignupData: Partial<SignupData>
  onDefaultEmailSignup: () => void
}

export type PreValidationSignupLastStepProps = {
  isSSOSubscription: boolean
  accessibilityLabelForNextStep?: string
  signUp: (token: string, marketingEmailSubscription: boolean) => Promise<void>
  previousSignupData: Partial<SignupData>
}

// Frontend discriminator to distinguish Apple from Google (same API shape)
type OAuthLoginRequest = Omit<OAuthSigninRequestV2, 'deviceInfo'> & {
  provider: Provider.GOOGLE | Provider.APPLE
}
export type LoginRequest = SigninRequest | OAuthLoginRequest

export const isOAuthLoginRequest = (req: LoginRequest): req is OAuthLoginRequest =>
  'provider' in req

export type LastLoginInfo = {
  maskedEmail: string
  provider: Provider
  lastLoginAt: string
}

export type FormattedLastLoginInfo = {
  maskedEmail: string
  provider: { type: Provider; label: string; icon: React.FC<AccessibleIcon> }
  lastLoginAt: string
}
