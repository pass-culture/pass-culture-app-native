import { IdentityCheckMethod } from 'api/gen'
import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'

const educonnectFlow: (keyof SubscriptionRootStackParamList)[] = [
  'EduConnectForm',
  'EduConnectValidation',
]

const ubbleFlow: (keyof SubscriptionRootStackParamList)[] = ['SelectIDOrigin']

const forkFlow: (keyof SubscriptionRootStackParamList)[] = ['IdentificationFork']

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
