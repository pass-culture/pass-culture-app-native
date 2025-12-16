import { useNavigation } from '@react-navigation/native'
import { FunctionComponent } from 'react'
import { TextStyle } from 'react-native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionPropConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { ExternalNavigationProps, InternalNavigationProps } from 'ui/components/touchableLink/types'
import { MaintenanceCone } from 'ui/svg/icons/MaintenanceCone'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { UserError } from 'ui/svg/UserError'
import { DOUBLE_LINE_BREAK } from 'ui/theme/constants'

export enum EduConnectErrorMessageEnum {
  DuplicateUser = 'DuplicateUser',
  UserAgeNotValid18YearsOld = 'UserAgeNotValid18YearsOld',
  UserAgeNotValid = 'UserAgeNotValid',
  UserTypeNotStudent = 'UserTypeNotStudent',
  UnknownErrorCode = 'UnknownErrorCode',
  GenericError = 'GenericError',
}

type NotEligibleEduConnectErrorData = {
  Illustration: FunctionComponent<AccessibleIcon>
  title: string
  description: string
  titleAlignment?: Exclude<TextStyle['textAlign'], 'auto'>
  descriptionAlignment?: Exclude<TextStyle['textAlign'], 'auto'>
  primaryButton?: {
    wording: string
    icon?: FunctionComponent<AccessibleIcon>
    onPress?: () => void
  } & (
    | {
        navigateTo: InternalNavigationProps['navigateTo']
        externalNav?: never
      }
    | {
        externalNav: ExternalNavigationProps['externalNav']
        navigateTo?: never
      }
  )

  isGoHomeTertiaryButtonVisible?: boolean
}

const UserAgeNotValidErrorData: NotEligibleEduConnectErrorData = {
  Illustration: UserError,
  title: 'Oh non\u00a0!',
  description:
    'La date de naissance enregistrée dans ÉduConnect semble indiquer que tu n’as pas l’âge requis pour obtenir l’aide de l’État.' +
    DOUBLE_LINE_BREAK +
    'S’il y a une erreur sur ta date de naissance, contacte ton établissement pour modifier ton profil ÉduConnect.',
  titleAlignment: 'center',
  descriptionAlignment: 'center',
}

const InvalidInformationErrorData: NotEligibleEduConnectErrorData = {
  Illustration: UserError,
  title: 'Oh non\u00a0!',
  description:
    'Il semblerait que les informations que tu nous as communiquées ne soient pas correctes.' +
    DOUBLE_LINE_BREAK +
    'Refais une demande en vérifiant ton identité avec ta pièce d’identité.',
  descriptionAlignment: 'center',
  primaryButton: {
    wording: 'Vérifier mon identité',
    navigateTo: getSubscriptionPropConfig('SelectIDOrigin'),
  },
  isGoHomeTertiaryButtonVisible: true,
}

const getUserTypeNotStudentErrorData = (
  onPrimaryButtonPress: () => void,
  navigateTo: InternalNavigationProps['navigateTo']
): NotEligibleEduConnectErrorData => ({
  Illustration: UserError,
  title: 'Qui est-ce\u00a0?',
  description:
    'Les informations provenant d’ÉduConnect indiquent que vous êtes le représentant légal d’un jeune scolarisé.' +
    DOUBLE_LINE_BREAK +
    'L’usage du pass Culture est strictement nominatif. Le compte doit être créé et utilisé par un jeune éligible, de 15 à 18 ans. L’identification doit se faire au nom du futur bénéficiaire. ',
  descriptionAlignment: 'center',
  primaryButton: {
    wording: 'Réessayer de m’identifier',
    onPress: onPrimaryButtonPress,
    navigateTo,
  },
  isGoHomeTertiaryButtonVisible: true,
})

const GenericErrorData: NotEligibleEduConnectErrorData = {
  Illustration: MaintenanceCone,
  title: 'Oups\u00a0!',
  description: 'Une erreur s’est produite pendant le chargement',
  titleAlignment: 'center',
  descriptionAlignment: 'center',
}

const DuplicateUserErrorData: NotEligibleEduConnectErrorData = {
  Illustration: UserError,
  title: 'As-tu déja un compte\u00a0?',
  description:
    'Ton compte ÉduConnect est déjà rattaché à un compte pass Culture. Vérifie que tu n’as pas déjà créé un compte avec une autre adresse e-mail.\n\nTu peux contacter le support pour plus d’informations.',
  descriptionAlignment: 'center',
  primaryButton: {
    wording: 'Contacter le support',
    externalNav: { url: env.SUPPORT_ACCOUNT_ISSUES_FORM },
    onPress: () => analytics.logHasClickedContactForm('NotEligibleEduConnect'), // In NotEligibleEduConnect.tsx, onPress is passed to onBeforeNavigate of buttonPrimary of GenericInfoPage
  },
  isGoHomeTertiaryButtonVisible: true,
}

export function useNotEligibleEduConnectErrorData(message: EduConnectErrorMessageEnum | string) {
  const { goBack } = useNavigation<UseNavigationType>()
  switch (message) {
    case EduConnectErrorMessageEnum.UserAgeNotValid18YearsOld:
      return InvalidInformationErrorData

    case EduConnectErrorMessageEnum.UserAgeNotValid:
      return UserAgeNotValidErrorData

    case EduConnectErrorMessageEnum.UserTypeNotStudent:
      return getUserTypeNotStudentErrorData(
        () => {
          goBack()
        },
        { ...getSubscriptionPropConfig('EduConnectForm') }
      )

    case EduConnectErrorMessageEnum.DuplicateUser:
      return DuplicateUserErrorData

    default:
      return GenericErrorData
  }
}
