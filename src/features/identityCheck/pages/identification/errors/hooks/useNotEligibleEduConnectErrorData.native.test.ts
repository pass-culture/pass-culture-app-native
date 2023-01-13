import { contactSupport } from 'features/auth/helpers/contactSupport'
import {
  EduConnectErrorMessageEnum,
  useNotEligibleEduConnectErrorData,
} from 'features/identityCheck/pages/identification/errors/hooks/useNotEligibleEduConnectErrorData'
import { renderHook } from 'tests/utils'
import { UserErrorWhite } from 'ui/svg/BicolorUserError'
import { Email } from 'ui/svg/icons/Email'

jest.mock('features/auth/signup/useBeneficiaryValidationNavigation')

jest.mock('features/auth/helpers/contactSupport')

describe('useNotEligibleEduConnectErrorData', () => {
  const mockSetError = jest.fn()

  const expectedDuplicatedUserData = {
    Illustration: UserErrorWhite,
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

  const expectedUserAgeNotValidErrorData = {
    Illustration: UserErrorWhite,
    title: 'Oh non\u00a0!',
    description:
      'La date de naissance enregistrée dans ÉduConnect semble indiquer que tu n’as pas l’âge requis pour obtenir l’aide de l’État.\n\nS’il y a une erreur sur ta date de naissance, contacte ton établissement pour modifier ton profil ÉduConnect.',
    titleAlignment: 'center',
    descriptionAlignment: 'center',
  }

  const expectedInvalidInformationErrorData = {
    Illustration: UserErrorWhite,
    title: 'Oh non\u00a0!',
    description:
      'Il semblerait que les informations que tu nous as communiquées ne soient pas correctes.\n\nRefais une demande en vérifiant ton identité avec ta pièce d’identité.',
    descriptionAlignment: 'center',
    primaryButton: {
      text: 'Vérifier mon identité',
      navigateTo: {
        params: undefined,
        screen: '',
      },
    },
    isGoHomeTertiaryButtonVisible: true,
  }

  const expectedUserTypeNotStudentErrorData = {
    Illustration: UserErrorWhite,
    title: 'Qui est-ce\u00a0?',
    description:
      'Les informations provenant d’ÉduConnect indiquent que vous êtes le représentant légal d’un jeune scolarisé.\n\nL’usage du pass Culture est strictement nominatif. Le compte doit être créé et utilisé par un jeune éligible, de 15 à 18 ans. L’identification doit se faire au nom du futur bénéficiaire. ',
    descriptionAlignment: 'center',
    primaryButton: {
      text: 'Réessayer de m’identifier',
      onPress: expect.any(Function),
      navigateTo: { screen: 'IdentityCheckEduConnectForm' },
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
      } = renderHook(() => useNotEligibleEduConnectErrorData(eduConnectError, mockSetError))

      expect(data).toEqual(expectedData)
    }
  )
})
