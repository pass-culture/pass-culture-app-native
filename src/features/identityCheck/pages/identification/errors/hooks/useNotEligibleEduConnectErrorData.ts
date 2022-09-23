import { useNavigation } from '@react-navigation/native'
import { FunctionComponent } from 'react'
import { TextStyle } from 'react-native'

import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { TouchableLinkProps } from 'ui/components/touchableLink/types'
import { MaintenanceCone } from 'ui/svg/icons/MaintenanceCone'
import { IconInterface } from 'ui/svg/icons/types'
import { UserError } from 'ui/svg/icons/UserError'
import { DOUBLE_LINE_BREAK } from 'ui/theme/constants'

export enum EduConnectErrorMessageEnum {
  UserAgeNotValid18YearsOld = 'UserAgeNotValid18YearsOld',
  UserAgeNotValid = 'UserAgeNotValid',
  UserTypeNotStudent = 'UserTypeNotStudent',
  UnknownErrorCode = 'UnknownErrorCode',
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
  navigateTo?: TouchableLinkProps['navigateTo']
}

const UserAgeNotValidErrorData: NotEligibleEduConnectErrorData = {
  Icon: UserError,
  title: 'Oh non\u00a0!',
  description:
    'La date de naissance enregistrée dans ÉduConnect semble indiquer que tu n’as pas l’âge requis pour obtenir l’aide du Gouvernement.' +
    DOUBLE_LINE_BREAK +
    'S’il y a une erreur sur ta date de naissance, contacte ton établissement pour modifier ton profil ÉduConnect.',
  titleAlignment: 'center',
  descriptionAlignment: 'center',
}

const getInvalidInformationErrorData = (
  navigateTo: TouchableLinkProps['navigateTo']
): NotEligibleEduConnectErrorData => ({
  Icon: UserError,
  title: 'Oh non\u00a0!',
  description:
    'Il semblerait que les informations que tu nous as communiquées ne soient pas correctes.' +
    DOUBLE_LINE_BREAK +
    'Refais une demande en vérifiant ton identité avec ta pièce d’identité.',
  descriptionAlignment: 'center',
  primaryButtonText: 'Vérifier mon identité',
  tertiaryButtonVisible: true,
  navigateTo,
})

const getUserTypeNotStudentErrorData = (
  onPrimaryButtonPress: () => void,
  navigateTo: TouchableLinkProps['navigateTo']
): NotEligibleEduConnectErrorData => ({
  Icon: UserError,
  title: 'Qui est-ce\u00a0?',
  description:
    'Les informations provenant d’ÉduConnect indiquent que vous êtes le représentant légal d’un jeune scolarisé.' +
    DOUBLE_LINE_BREAK +
    'L’usage du pass Culture est strictement nominatif. Le compte doit être créé et utilisé par un jeune éligible, de 15 à 18 ans. L’identification doit se faire au nom du futur bénéficiaire. ',
  descriptionAlignment: 'center',
  primaryButtonText: 'Réessayer de m’identifier',
  tertiaryButtonVisible: true,
  onPrimaryButtonPress,
  navigateTo,
})

const GenericErrorData: NotEligibleEduConnectErrorData = {
  Icon: MaintenanceCone,
  title: 'Oups\u00a0!',
  description: 'Une erreur s’est produite pendant le chargement',
  titleAlignment: 'center',
  descriptionAlignment: 'center',
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

    default:
      return GenericErrorData
  }
}
