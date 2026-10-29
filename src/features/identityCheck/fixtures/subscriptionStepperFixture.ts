import { IdentityCheckMethod, SubscriptionStep, SubscriptionStepperResponseV3 } from 'api/gen'

export const subscriptionStepperFixture: SubscriptionStepperResponseV3 = {
  allowedIdentityCheckMethods: [IdentityCheckMethod.ubble, IdentityCheckMethod.educonnect],
  nextSubscriptionStep: SubscriptionStep['identity-check'],
  hasIdentityCheckPending: false,
  subscriptionMessage: null,
  title: 'Title',
  subscriptionStepsToDisplay: [],
}
