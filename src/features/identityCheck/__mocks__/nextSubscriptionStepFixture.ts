import { IdentityCheckMethod, NextSubscriptionStepResponse, SubscriptionStep } from 'api/gen'

export const nextSubscriptionStepFixture: NextSubscriptionStepResponse = {
  allowedIdentityCheckMethods: [IdentityCheckMethod.ubble, IdentityCheckMethod.educonnect],
  nextSubscriptionStep: SubscriptionStep['identity-check'],
  hasIdentityCheckPending: false,
  stepperIncludesPhoneValidation: false,
  subscriptionMessage: null,
}
