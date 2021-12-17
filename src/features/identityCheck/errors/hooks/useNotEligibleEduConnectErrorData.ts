import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { FunctionComponent } from 'react'
import { TextStyle } from 'react-native'

import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { Clock } from 'ui/svg/icons/Clock'
import { InfoFraud } from 'ui/svg/icons/InfoFraud'
import { MaintenanceCone } from 'ui/svg/icons/MaintenanceCone'
import { IconInterface } from 'ui/svg/icons/types'

export enum EduConnectErrorMessageEnum {
  UserAgeNotValid18YearsOld = 'UserAgeNotValid18YearsOld',
  UserAgeNotValid = 'UserAgeNotValid',
  UserNotWhitelisted = 'UserNotWhitelisted',
  UserTypeNotStudent = 'UserTypeNotStudent',
  GenericError = 'GenericError',
}

type NotEligibleEduConnectErrorData = {
  Icon: FunctionComponent<IconInterface>
  title: string
  description: string
  titleAlignment?: Exclude<TextStyle['textAlign'], 'auto'>
  descriptionAlignment?: Exclude<TextStyle['textAlign'], 'auto'>
  primaryButtonText?: string
  tertiaryButtonVisible?: boolean
  onPrimaryButtonPress?: () => void
}

const UserNotWhitelisted: NotEligibleEduConnectErrorData = {
  Icon: Clock,
  title: t`Tu ne fais pas partie de la phase de test`,
  description:
    t`Encore un peu de patience\u00a0: en fonction de ton âge, tu pourras compléter ton inscription à la date suivante\u00a0: ` +
    '\n\n' +
    t`17 ans, le 10 janvier` +
    '\n' +
    t`16 ans, le 20 janvier` +
    '\n' +
    t`15 ans, le 31 janvier` +
    '\n\n' +
    t`En attendant, tu peux tout de même découvrir l'application mais sans pouvoir réserver les offres.`,
  titleAlignment: 'left',
  descriptionAlignment: 'center',
}

const UserAgeNotValid: NotEligibleEduConnectErrorData = {
  Icon: InfoFraud,
  title: t`Oh non\u00a0!`,
  description:
    t`La date de naissance enregistrée dans ÉduConnect semble indiquer que tu n'as pas l'âge requis pour obtenir l'aide du Gouvernement.` +
    '\n\n' +
    t`S’il y a une erreur sur ta date de naissance, contacte ton établissement pour modifier ton profil ÉduConnect.`,
  titleAlignment: 'center',
  descriptionAlignment: 'center',
}

const getInvalidInformation = (
  onPrimaryButtonPress: () => Promise<void>
): NotEligibleEduConnectErrorData => ({
  Icon: InfoFraud,
  title: t`Oh non\u00a0!`,
  description:
    t`Il semblerait que les informations que tu nous as communiquées ne soient pas correctes.` +
    '\n\n' +
    t`Refais une demande en vérifiant ton identité avec ta pièce d’identité.`,
  descriptionAlignment: 'center',
  primaryButtonText: t`Vérifier mon identité`,
  tertiaryButtonVisible: true,
  onPrimaryButtonPress,
})

const getUserTypeNotStudent = (
  onPrimaryButtonPress: () => void
): NotEligibleEduConnectErrorData => ({
  Icon: InfoFraud,
  title: t`Qui est-ce\u00a0?`,
  description:
    t`Les informations provenant d'ÉduConnect indiquent que vous êtes le représentant légal d'un jeune scolarisé.` +
    '\n\n' +
    t`L'usage du pass Culture est strictement nominatif. Le compte doit être créé et utilisé par un jeune éligible, de 15 à 18 ans. L'identification doit se faire au nom du futur bénéficiaire. `,
  descriptionAlignment: 'center',
  primaryButtonText: t`Réessayer de m'identifier`,
  tertiaryButtonVisible: true,
  onPrimaryButtonPress,
})

const GenericError: NotEligibleEduConnectErrorData = {
  Icon: MaintenanceCone,
  title: t`Oups\u00a0!`,
  description: t`Une erreur s'est produite pendant le chargement`,
  titleAlignment: 'center',
  descriptionAlignment: 'center',
}

export function useNotEligibleEduConnectErrorData(
  message: EduConnectErrorMessageEnum | string,
  setError: (error: Error | undefined) => void
) {
  const { navigateToNextBeneficiaryValidationStep } = useBeneficiaryValidationNavigation(setError)
  const { goBack, navigate } = useNavigation<UseNavigationType>()
  switch (message) {
    case EduConnectErrorMessageEnum.UserAgeNotValid18YearsOld:
      return getInvalidInformation(navigateToNextBeneficiaryValidationStep)

    case EduConnectErrorMessageEnum.UserAgeNotValid:
      return UserAgeNotValid

    case EduConnectErrorMessageEnum.UserTypeNotStudent:
      return getUserTypeNotStudent(() => {
        goBack()
        navigate('IdentityCheckEduConnectForm')
      })

    case EduConnectErrorMessageEnum.UserNotWhitelisted:
      return UserNotWhitelisted

    default:
      return GenericError
  }
}
