import { IdentityCheckMethod } from 'api/gen'
import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'

const educonnectFlow: (keyof SubscriptionRootStackParamList)[] = [
  'IdentityCheckEduConnect',
  'IdentityCheckEduConnectForm',
  'IdentityCheckValidation',
]

const ubbleFlow: (keyof SubscriptionRootStackParamList)[] = ['SelectIDOrigin']

const ubbleForkFlow: (keyof SubscriptionRootStackParamList)[] = ['IdentificationForkUbble']

const educonnectForkFlow: (keyof SubscriptionRootStackParamList)[] = [
  'IdentificationForkEduconnect',
]

export const computeIdentificationMethod = (
  identificationMethods?: IdentityCheckMethod[] | null,
  identificationMethodFork?: string | null
) => {
  if (identificationMethods) {
    if (identificationMethods.length === 2) {
      return identificationMethodFork === IdentityCheckMethod.educonnect
        ? educonnectForkFlow
        : ubbleForkFlow
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
