import { useNavigation } from '@react-navigation/native'
import { FunctionComponent } from 'react'
import { TextStyle } from 'react-native'

import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { contactSupport } from 'features/auth/support.services'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { ExternalNavigationProps, TouchableLinkProps } from 'ui/components/touchableLink/types'
import { UserError } from 'ui/svg/BicolorUserError'
import { Email } from 'ui/svg/icons/Email'
import { MaintenanceCone } from 'ui/svg/icons/MaintenanceCone'
import { IconInterface } from 'ui/svg/icons/types'
import { DOUBLE_LINE_BREAK } from 'ui/theme/constants'

export enum EduConnectErrorMessageEnum {
  DuplicateUser = 'DuplicateUser',
  UserAgeNotValid18YearsOld = 'UserAgeNotValid18YearsOld',
  UserAgeNotValid = 'UserAgeNotValid',
  UserTypeNotStudent = 'UserTypeNotStudent',
  UnknownErrorCode = 'UnknownErrorCode',
  GenericError = 'GenericError',
}

export type NotEligibleEduConnectErrorData = {
  Illustration: FunctionComponent<IconInterface>
  title: string
  description: string
  titleAlignment?: Exclude<TextStyle['textAlign'], 'auto'>
  descriptionAlignment?: Exclude<TextStyle['textAlign'], 'auto'>
  primaryButton?: {
    text: string
    icon?: FunctionComponent<IconInterface>
    onPress?: () => void
  } & (
    | { navigateTo: TouchableLinkProps['navigateTo'] }
    | { externalNav: ExternalNavigationProps['externalNav'] }
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

const getInvalidInformationErrorData = (
  navigateTo: TouchableLinkProps['navigateTo']
): NotEligibleEduConnectErrorData => ({
  Illustration: UserError,
  title: 'Oh non\u00a0!',
  description:
    'Il semblerait que les informations que tu nous as communiquées ne soient pas correctes.' +
    DOUBLE_LINE_BREAK +
    'Refais une demande en vérifiant ton identité avec ta pièce d’identité.',
  descriptionAlignment: 'center',
  primaryButton: {
    text: 'Vérifier mon identité',
    navigateTo,
  },
  isGoHomeTertiaryButtonVisible: true,
})

const getUserTypeNotStudentErrorData = (
  onPrimaryButtonPress: () => void,
  navigateTo: TouchableLinkProps['navigateTo']
): NotEligibleEduConnectErrorData => ({
  Illustration: UserError,
  title: 'Qui est-ce\u00a0?',
  description:
    'Les informations provenant d’ÉduConnect indiquent que vous êtes le représentant légal d’un jeune scolarisé.' +
    DOUBLE_LINE_BREAK +
    'L’usage du pass Culture est strictement nominatif. Le compte doit être créé et utilisé par un jeune éligible, de 15 à 18 ans. L’identification doit se faire au nom du futur bénéficiaire. ',
  descriptionAlignment: 'center',
  primaryButton: {
    text: 'Réessayer de m’identifier',
    onPress: onPrimaryButtonPress,
    navigateTo,
  },
  isGoHomeTertiaryButtonVisible: true,
})

const GenericErrorData: NotEligibleEduConnectErrorData = {
  Illustration: MaintenanceCone,
  title: 'Oups\u00a0!',
  description: "Une erreur s'est produite pendant le chargement",
  titleAlignment: 'center',
  descriptionAlignment: 'center',
}

const DuplicateUserErrorData: NotEligibleEduConnectErrorData = {
  Illustration: UserError,
  title: 'As-tu déja un compte\u00a0?',
  description:
    "Ton compte ÉduConnect est déjà rattaché à un compte pass Culture. Vérifie que tu n'as pas déjà créé un compte avec une autre adresse e-mail.\n\nTu peux contacter le support pour plus d'informations.",
  descriptionAlignment: 'center',
  primaryButton: {
    text: 'Contacter le support',
    icon: Email,
    externalNav: contactSupport.forGenericQuestion,
  },
  isGoHomeTertiaryButtonVisible: true,
}

export function useNotEligibleEduConnectErrorData(
  message: EduConnectErrorMessageEnum | string,
  setError: (error: Error | undefined) => void
) {
  const { nextBeneficiaryValidationStepNavConfig } = useBeneficiaryValidationNavigation(setError)
  const { goBack } = useNavigation<UseNavigationType>()
  switch (message) {
    case EduConnectErrorMessageEnum.UserAgeNotValid18YearsOld:
      return getInvalidInformationErrorData(nextBeneficiaryValidationStepNavConfig)

    case EduConnectErrorMessageEnum.UserAgeNotValid:
      return UserAgeNotValidErrorData

    case EduConnectErrorMessageEnum.UserTypeNotStudent:
      return getUserTypeNotStudentErrorData(
        () => {
          goBack()
        },
        { screen: 'IdentityCheckEduConnectForm' }
      )

    case EduConnectErrorMessageEnum.DuplicateUser:
      return DuplicateUserErrorData

    default:
      return GenericErrorData
  }
}
