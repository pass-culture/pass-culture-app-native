import { IdentityCheckMethod, SubscriptionStep, SubscriptionStepperResponseV2 } from 'api/gen'

export const subscriptionStepperFixture: SubscriptionStepperResponseV2 = {
  allowedIdentityCheckMethods: [IdentityCheckMethod.ubble, IdentityCheckMethod.educonnect],
  nextSubscriptionStep: SubscriptionStep['identity-check'],
  hasIdentityCheckPending: false,
  subscriptionMessage: null,
  title: 'Title',
  subscriptionStepsToDisplay: [],
}
