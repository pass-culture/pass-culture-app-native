import { IdentityCheckMethod } from 'api/gen'
import { SubscriptionScreen } from 'features/identityCheck/types'

const educonnectFlowFirstScreen: SubscriptionScreen = 'EduConnectForm'

const ubbleFlowFirstScreen: SubscriptionScreen = 'SelectIDOrigin'

const forkScreen: SubscriptionScreen = 'IdentificationFork'

export const computeIdentificationMethod = (
  identificationMethods?: IdentityCheckMethod[] | null
) => {
  if (identificationMethods) {
    if (identificationMethods.length === 2) {
      return forkScreen
    }

    if (
      identificationMethods.length === 1 &&
      identificationMethods[0] === IdentityCheckMethod.educonnect
    ) {
      return educonnectFlowFirstScreen
    }
  }

  return ubbleFlowFirstScreen
}
