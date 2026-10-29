import {
  IdentityCheckMethod,
  SubscriptionStep,
  SubscriptionStepCompletionState,
  SubscriptionStepTitle,
  SubscriptionStepperResponseV3,
} from 'api/gen'

export const SubscriptionStepperResponseFixture: SubscriptionStepperResponseV3 = {
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

export const SubscriptionStepperErrorResponseFixture: SubscriptionStepperResponseV3 = {
  ...SubscriptionStepperResponseFixture,
  subtitle: null,
  subscriptionMessage: {
    userMessage: '',
    messageSummary: 'Tu n’as pas fournis les bons documents',
  },
}
