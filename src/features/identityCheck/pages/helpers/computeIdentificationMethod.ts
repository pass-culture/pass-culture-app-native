import { IdentityCheckMethod } from 'api/gen'
import { SubscriptionScreen } from 'features/identityCheck/types'

const educonnectFlow: SubscriptionScreen = 'EduConnectForm'

const ubbleFlow: SubscriptionScreen = 'SelectIDOrigin'

const forkFlow: SubscriptionScreen = 'IdentificationFork'

export const computeIdentificationMethod = (
  identificationMethods?: IdentityCheckMethod[] | null
) => {
  if (identificationMethods) {
    if (identificationMethods.length === 2) {
      return forkFlow
    }

    if (
      identificationMethods.length === 1 &&
      identificationMethods[0] === IdentityCheckMethod.educonnect
    ) {
      return educonnectFlow
    }
  }

  return ubbleFlow
}
