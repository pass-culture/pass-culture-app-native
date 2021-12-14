import { t } from '@lingui/macro'
import { FunctionComponent } from 'react'
import { TextStyle } from 'react-native'

import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { Clock } from 'ui/svg/icons/Clock'
import { InfoFraud } from 'ui/svg/icons/InfoFraud'
import { IconInterface } from 'ui/svg/icons/types'

export enum EduConnectErrorMessageEnum {
  UserAgeNotValid18YearsOld = 'UserAgeNotValid18YearsOld',
  UserAgeNotValid = 'UserAgeNotValid',
  UserTypeNotStudent = 'UserTypeNotStudent',
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

//(Yorick) TODO : cette page n'a pas lieu d'exister, on fallback vers une erreur générique
const OutOfTestPhase: NotEligibleEduConnectErrorData = {
  Icon: Clock,
  title: t`Tu ne fais pas partie de la phase de test`,
  description:
    t`Le pass Culture pour les jeunes de 15 à 17 ans est actuellement en phase de test auprès de 22 établissements scolaires des académies de Rennes et de Versailles.` +
    '\n\n' +
    t`Encore un peu de patience... On se donne rendez-vous en janvier 2022 : nous reviendrons vers toi dès que le pass te sera accessible.` +
    '\n\n' +
    t`En attendant, tu peux tout de même découvrir l'application mais sans pouvoir réserver les offres.`,
  titleAlignment: 'left',
  descriptionAlignment: 'left',
}

const UserAgeNotValid: NotEligibleEduConnectErrorData = {
  Icon: InfoFraud,
  title: t`Oh non !`,
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
  title: t`Oh non !`,
  description:
    t`Il semblerait que les informations que tu nous as communiquées ne soient pas correctes.` +
    '\n\n' +
    t`Refais une demande en vérifiant ton identité avec ta pièce d’identité.`,
  descriptionAlignment: 'center',
  primaryButtonText: t`Vérifier mon identité`,
  tertiaryButtonVisible: true,
  onPrimaryButtonPress,
})

const UserTypeNotStudent: NotEligibleEduConnectErrorData = {
  Icon: InfoFraud,
  title: t`Qui est-ce ?`,
  description:
    t`Les informations provenant d'ÉduConnect indiquent que vous êtes le représentant légal d'un jeune scolarisé.` +
    '\n\n' +
    t`L'usage du pass Culture est strictement nominatif. Le compte doit être créé et utilisé par un jeune éligible, de 15 à 18 ans. L'identification doit se faire au nom du futur bénéficiaire. `,
  descriptionAlignment: 'center',
  primaryButtonText: t`Réessayer de m'identifier`,
  tertiaryButtonVisible: true,
  onPrimaryButtonPress: () => {
    //(Wendy) TODO: Dans le prochain Ticket ajouter une navigation pour revenir à l'action précédente
  },
}

export function useNotEligibleEduConnectErrorData(
  message: EduConnectErrorMessageEnum | string,
  setError: (error: Error) => void
) {
  const { navigateToNextBeneficiaryValidationStep } = useBeneficiaryValidationNavigation(setError)
  switch (message) {
    case EduConnectErrorMessageEnum.UserAgeNotValid18YearsOld:
      return getInvalidInformation(navigateToNextBeneficiaryValidationStep)

    case EduConnectErrorMessageEnum.UserAgeNotValid:
      return UserAgeNotValid

    case EduConnectErrorMessageEnum.UserTypeNotStudent:
      return UserTypeNotStudent

    default:
      return OutOfTestPhase
  }
}
