import { IdentityCheckMethod } from 'api/gen'
import { SubscriptionScreen } from 'features/identityCheck/types'

const educonnectFlowFirstScreen: SubscriptionScreen = 'EduConnectForm'
const ubbleFlowFirstScreen: SubscriptionScreen = 'SelectIDOrigin'
const forkScreen: SubscriptionScreen = 'IdentificationFork'

export const computeIdentificationMethod = (
  isUserRegisteredInPacificFrancRegion: boolean,
  identificationMethods?: IdentityCheckMethod[] | null
) => {
  if (identificationMethods) {
    if (isUserRegisteredInPacificFrancRegion) return ubbleFlowFirstScreen

    const hasTwoMethods = identificationMethods.length === 2
    if (hasTwoMethods) return forkScreen

    const hasOneMethod = identificationMethods.length === 1
    const isEduconnectMethod = identificationMethods[0] === IdentityCheckMethod.educonnect
    if (hasOneMethod && isEduconnectMethod) return educonnectFlowFirstScreen
  }

  return ubbleFlowFirstScreen
}
