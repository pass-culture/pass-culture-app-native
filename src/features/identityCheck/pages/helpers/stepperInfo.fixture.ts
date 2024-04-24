import {
  IdentityCheckMethod,
  SubscriptionStep,
  SubscriptionStepCompletionState,
  SubscriptionStepperResponseV2,
  SubscriptionStepTitle,
} from 'api/gen'

export const SubscriptionStepperResponseFixture: SubscriptionStepperResponseV2 = {
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
  hasIdentityCheckPending: false,
}

export const SubscriptionStepperErrorResponseFixture: SubscriptionStepperResponseV2 = {
  ...SubscriptionStepperResponseFixture,
  subtitle: null,
  subscriptionMessage: {
    userMessage: '',
    messageSummary: 'Tu n’as pas fournis les bons documents',
  },
}

export const SubscriptionStepperResponseWithPhoneValidationFixture: SubscriptionStepperResponseV2 =
  {
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
