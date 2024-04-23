import type { ReadonlyDeep } from 'type-fest'

import { PreValidationSignupStep } from 'features/auth/enums'
import { AcceptCgu } from 'features/auth/pages/signup/AcceptCgu/AcceptCgu'
import { SetBirthday } from 'features/auth/pages/signup/SetBirthday/SetBirthday'
import { SetEmail } from 'features/auth/pages/signup/SetEmail/SetEmail'
import { SetPassword } from 'features/auth/pages/signup/SetPassword/SetPassword'
import {
  Props as ConfirmationEmailSentProps,
  SignupConfirmationEmailSent,
} from 'features/auth/pages/signup/SignupConfirmationEmailSent/SignupConfirmationEmailSent'
import {
  PreValidationSignupNormalStepProps,
  PreValidationSignupLastStepProps,
} from 'features/auth/types'
import { toMutable } from 'shared/types/toMutable'

type SignupStepConfig = {
  name: PreValidationSignupStep
  Component:
    | React.FunctionComponent<PreValidationSignupNormalStepProps>
    | React.FunctionComponent<PreValidationSignupLastStepProps>
    | React.FunctionComponent<ConfirmationEmailSentProps>
  accessibilityTitle: string
}

export const DEFAULT_STEP_CONFIG = toMutable([
  {
    name: PreValidationSignupStep.Email,
    Component: SetEmail,
    accessibilityTitle: 'Adresse e-mail',
  },
  {
    name: PreValidationSignupStep.Password,
    Component: SetPassword,
    accessibilityTitle: 'Mot de passe',
  },
  {
    name: PreValidationSignupStep.Birthday,
    Component: SetBirthday,
    accessibilityTitle: 'Date de naissance',
  },
  {
    name: PreValidationSignupStep.CGU,
    accessibilityTitle: 'CGU & Données',
    Component: AcceptCgu,
  },
  {
    name: PreValidationSignupStep.ConfirmationEmailSent,
    accessibilityTitle: 'Confirmation d‘envoi d‘e-mail',
    Component: SignupConfirmationEmailSent,
  },
] as const satisfies ReadonlyDeep<SignupStepConfig[]>)

export const SSO_STEP_CONFIG = toMutable([
  {
    name: PreValidationSignupStep.Email,
    Component: SetEmail,
    accessibilityTitle: 'Adresse e-mail',
  },
  {
    name: PreValidationSignupStep.Birthday,
    Component: SetBirthday,
    accessibilityTitle: 'Date de naissance',
  },
  {
    name: PreValidationSignupStep.CGU,
    accessibilityTitle: 'CGU & Données',
    Component: AcceptCgu,
  },
] as const satisfies ReadonlyDeep<SignupStepConfig[]>)
