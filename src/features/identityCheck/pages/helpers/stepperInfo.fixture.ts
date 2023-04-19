import {
  IdentityCheckMethod,
  SubscriptionStep,
  SubscriptionStepCompletionState,
  SubscriptionStepperResponse,
  SubscriptionStepTitle,
} from 'api/gen'

export const SubscriptionStepperResponseFixture: SubscriptionStepperResponse = {
  title: 'Titre Stepper',
  subtitle: 'Sous titre Stepper',
  subscriptionStepsToDisplay: [
    {
      name: SubscriptionStep['profile-completion'],
      completionState: SubscriptionStepCompletionState.completed,
      title: SubscriptionStepTitle['Profil'],
      subtitle: 'Sous-titre Profil',
    },
    {
      name: SubscriptionStep['identity-check'],
      completionState: SubscriptionStepCompletionState.current,
      title: SubscriptionStepTitle['Identification'],
      subtitle: 'Sous-titre Identification',
    },
    {
      name: SubscriptionStep['honor-statement'],
      completionState: SubscriptionStepCompletionState.disabled,
      title: SubscriptionStepTitle['Confirmation'],
      subtitle: 'Sous-titre Confirmation',
    },
    {
      name: SubscriptionStep['maintenance'],
      completionState: SubscriptionStepCompletionState.disabled,
      title: SubscriptionStepTitle['Confirmation'],
      subtitle: 'Maintenance',
    },
  ],
  allowedIdentityCheckMethods: [IdentityCheckMethod.ubble, IdentityCheckMethod.educonnect],
}

export const SubscriptionStepperErrorResponseFixture: SubscriptionStepperResponse = {
  ...SubscriptionStepperResponseFixture,
  subtitle: null,
  errorMessage: 'Tu n’as pas fournis les bons documents',
}

export const SubscriptionStepperResponseWithPhoneValidationFixture: SubscriptionStepperResponse = {
  ...SubscriptionStepperResponseFixture,
  subscriptionStepsToDisplay: [
    ...SubscriptionStepperResponseFixture.subscriptionStepsToDisplay,
    {
      name: SubscriptionStep['phone-validation'],
      completionState: SubscriptionStepCompletionState.completed,
      title: SubscriptionStepTitle['Numéro de téléphone'],
      subtitle: 'Sous-titre Numéro de téléphone',
    },
  ],
}
