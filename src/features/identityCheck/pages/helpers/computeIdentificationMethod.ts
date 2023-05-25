import { IdentityCheckMethod } from 'api/gen'
import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'

const educonnectFlow: (keyof SubscriptionRootStackParamList)[] = [
  'IdentityCheckEduConnect',
  'IdentityCheckEduConnectForm',
  'IdentityCheckValidation',
]

const ubbleFlow: (keyof SubscriptionRootStackParamList)[] = ['SelectIDOrigin']

// Two screen flows are declared for the purpose of an AB testing
const ubbleOnTopForkFlow: (keyof SubscriptionRootStackParamList)[] = ['IdentificationForkUbble']
const educonnectOnTopForkFlow: (keyof SubscriptionRootStackParamList)[] = [
  'IdentificationForkEduconnect',
]

export const computeIdentificationMethod = (
  identificationMethods?: IdentityCheckMethod[] | null,
  identificationMethodFork?: string | null
) => {
  if (identificationMethods) {
    if (identificationMethods.length === 2) {
      return identificationMethodFork === IdentityCheckMethod.educonnect
        ? educonnectOnTopForkFlow
        : ubbleOnTopForkFlow
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
