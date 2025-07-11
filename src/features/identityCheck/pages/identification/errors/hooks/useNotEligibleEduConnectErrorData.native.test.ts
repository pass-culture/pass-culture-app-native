import { contactSupport } from 'features/auth/helpers/contactSupport'
import {
  EduConnectErrorMessageEnum,
  useNotEligibleEduConnectErrorData,
} from 'features/identityCheck/pages/identification/errors/hooks/useNotEligibleEduConnectErrorData'
import { renderHook } from 'tests/utils'
import { Email } from 'ui/svg/icons/Email'
import { UserError } from 'ui/svg/UserError'

jest.mock('features/auth/helpers/contactSupport')

describe('useNotEligibleEduConnectErrorData', () => {
  const expectedDuplicatedUserData = {
    Illustration: UserError,
    title: 'As-tu déja un compte\u00a0?',
    description:
      'Ton compte ÉduConnect est déjà rattaché à un compte pass Culture. Vérifie que tu n’as pas déjà créé un compte avec une autre adresse e-mail.\n\nTu peux contacter le support pour plus d’informations.',
    descriptionAlignment: 'center',
    primaryButton: {
      wording: 'Contacter le support',
      icon: Email,
      externalNav: contactSupport.forGenericQuestion,
    },
    isGoHomeTertiaryButtonVisible: true,
  }

  const expectedUserAgeNotValidErrorData = {
    Illustration: UserError,
    title: 'Oh non\u00a0!',
    description:
      'La date de naissance enregistrée dans ÉduConnect semble indiquer que tu n’as pas l’âge requis pour obtenir l’aide de l’État.\n\nS’il y a une erreur sur ta date de naissance, contacte ton établissement pour modifier ton profil ÉduConnect.',
    titleAlignment: 'center',
    descriptionAlignment: 'center',
  }

  const expectedInvalidInformationErrorData = {
    Illustration: UserError,
    title: 'Oh non\u00a0!',
    description:
      'Il semblerait que les informations que tu nous as communiquées ne soient pas correctes.\n\nRefais une demande en vérifiant ton identité avec ta pièce d’identité.',
    descriptionAlignment: 'center',
    primaryButton: {
      wording: 'Vérifier mon identité',
      navigateTo: { screen: 'SubscriptionStackNavigator', params: { screen: 'SelectIDOrigin' } },
    },
    isGoHomeTertiaryButtonVisible: true,
  }

  const expectedUserTypeNotStudentErrorData = {
    Illustration: UserError,
    title: 'Qui est-ce\u00a0?',
    description:
      'Les informations provenant d’ÉduConnect indiquent que vous êtes le représentant légal d’un jeune scolarisé.\n\nL’usage du pass Culture est strictement nominatif. Le compte doit être créé et utilisé par un jeune éligible, de 15 à 18 ans. L’identification doit se faire au nom du futur bénéficiaire. ',
    descriptionAlignment: 'center',
    primaryButton: {
      wording: 'Réessayer de m’identifier',
      onPress: expect.any(Function),
      navigateTo: {
        params: {
          params: undefined,
          screen: 'EduConnectForm',
        },
        screen: 'SubscriptionStackNavigator',
      },
    },
    isGoHomeTertiaryButtonVisible: true,
  }

  it.each`
    eduConnectError                                         | expectedData
    ${EduConnectErrorMessageEnum.DuplicateUser}             | ${expectedDuplicatedUserData}
    ${EduConnectErrorMessageEnum.UserAgeNotValid}           | ${expectedUserAgeNotValidErrorData}
    ${EduConnectErrorMessageEnum.UserAgeNotValid18YearsOld} | ${expectedInvalidInformationErrorData}
    ${EduConnectErrorMessageEnum.UserTypeNotStudent}        | ${expectedUserTypeNotStudentErrorData}
  `(
    'should return the correct dataset if the eduConnect error is : $eduConnectError',
    ({ eduConnectError, expectedData }) => {
      const {
        result: { current: data },
      } = renderHook(() => useNotEligibleEduConnectErrorData(eduConnectError))

      expect(data).toEqual(expectedData)
    }
  )
})
