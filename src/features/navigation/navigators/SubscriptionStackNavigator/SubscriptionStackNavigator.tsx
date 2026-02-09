import { createComponentForStaticNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { BonificationBirthDate } from 'features/bonification/pages/BonificationBirthDate'
import { BonificationBirthPlace } from 'features/bonification/pages/BonificationBirthPlace'
import { BonificationError } from 'features/bonification/pages/BonificationError'
import { BonificationGranted } from 'features/bonification/pages/BonificationGranted'
import { BonificationNames } from 'features/bonification/pages/BonificationNames'
import { BonificationRecap } from 'features/bonification/pages/BonificationRecap'
import { BonificationRefused } from 'features/bonification/pages/BonificationRefused'
import { BonificationTitle } from 'features/bonification/pages/BonificationTitle'
import { CulturalSurveyIntro } from 'features/culturalSurvey/pages/CulturalSurveyIntro'
import { CulturalSurveyQuestions } from 'features/culturalSurvey/pages/CulturalSurveyQuestions'
import { CulturalSurveyThanks } from 'features/culturalSurvey/pages/CulturalSurveyThanks'
import { FAQWebview } from 'features/culturalSurvey/pages/FAQWebview'
import { BeneficiaryAccountCreated } from 'features/identityCheck/pages/confirmation/BeneficiaryAccountCreated'
import { BeneficiaryRequestSent } from 'features/identityCheck/pages/confirmation/BeneficiaryRequestSent'
import { IdentityCheckHonor } from 'features/identityCheck/pages/confirmation/IdentityCheckHonor'
import { DisableActivation } from 'features/identityCheck/pages/DisableActivation'
import { DMSIntroduction } from 'features/identityCheck/pages/identification/dms/DMSIntroduction'
import { IdentityCheckDMS } from 'features/identityCheck/pages/identification/dms/IdentityCheckDMS'
import { EduConnectForm } from 'features/identityCheck/pages/identification/educonnect/EduConnectForm'
import { EduConnectValidation } from 'features/identityCheck/pages/identification/educonnect/EduConnectValidation'
import { EduConnectErrors } from 'features/identityCheck/pages/identification/errors/eduConnect/EduConnectErrors'
import { IdentificationFork } from 'features/identityCheck/pages/identification/IdentificationFork'
import { IdentityCheckUnavailable } from 'features/identityCheck/pages/identification/IdentityCheckUnavailable'
import { ComeBackLater } from 'features/identityCheck/pages/identification/ubble/ComeBackLater'
import { ExpiredOrLostID } from 'features/identityCheck/pages/identification/ubble/ExpiredOrLostID'
import { IdentityCheckEnd } from 'features/identityCheck/pages/identification/ubble/IdentityCheckEnd'
import { IdentityCheckPending } from 'features/identityCheck/pages/identification/ubble/IdentityCheckPending'
import { SelectIDOrigin } from 'features/identityCheck/pages/identification/ubble/SelectIDOrigin'
import { SelectIDStatus } from 'features/identityCheck/pages/identification/ubble/SelectIDStatus'
import { SelectPhoneStatus } from 'features/identityCheck/pages/identification/ubble/SelectPhoneStatus.web'
import { UbbleWebview } from 'features/identityCheck/pages/identification/ubble/UbbleWebview'
import { PhoneValidationTooManyAttempts } from 'features/identityCheck/pages/phoneValidation/errors/PhoneValidationTooManyAttempts'
import { PhoneValidationTooManySMSSent } from 'features/identityCheck/pages/phoneValidation/errors/PhoneValidationTooManySMSSent'
import { SetPhoneNumber } from 'features/identityCheck/pages/phoneValidation/SetPhoneNumber'
import { SetPhoneNumberWithoutValidation } from 'features/identityCheck/pages/phoneValidation/SetPhoneNumberWithoutValidation'
import { SetPhoneValidationCode } from 'features/identityCheck/pages/phoneValidation/SetPhoneValidationCode'
import { ProfileInformationValidationCreate } from 'features/identityCheck/pages/profile/ProfileInformationValidationCreate'
import { SetAddress } from 'features/identityCheck/pages/profile/SetAddress'
import { SetCity } from 'features/identityCheck/pages/profile/SetCity'
import { SetName } from 'features/identityCheck/pages/profile/SetName'
import { SetProfileBookingError } from 'features/identityCheck/pages/profile/SetProfileBookingError'
import { SetStatus } from 'features/identityCheck/pages/profile/SetStatus'
import { Stepper } from 'features/identityCheck/pages/Stepper'
import { ROOT_NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/navigators/RootNavigator/navigationOptions'

const subscriptionStackNavigatorDefinition = {
  screenOptions: ROOT_NAVIGATOR_SCREEN_OPTIONS,
  screens: {
    CulturalSurveyIntro: {
      screen: CulturalSurveyIntro,
      linking: {
        path: 'questionnaire-pratiques-initiales/introduction',
      },
    },
    CulturalSurveyQuestions: {
      screen: CulturalSurveyQuestions,
      linking: {
        path: 'questionnaire-pratiques-initiales/questions',
      },
    },
    CulturalSurveyThanks: {
      screen: CulturalSurveyThanks,
      linking: {
        path: 'questionnaire-pratiques-initiales/merci',
      },
    },
    FAQWebview: {
      screen: FAQWebview,
      linking: {
        path: 'questionnaire-pratiques-initiales/foire-aux-questions',
      },
    },
    Stepper: {
      screen: Stepper,
      linking: {
        path: 'verification-identite',
      },
    },
    DisableActivation: {
      screen: DisableActivation,
      linking: {
        path: 'creation-compte/desactivation',
      },
    },
    SetPhoneNumberWithoutValidation: {
      screen: SetPhoneNumberWithoutValidation,
      linking: {
        path: 'creation-compte/telephone-sans-validation',
      },
    },
    SetPhoneNumber: {
      screen: SetPhoneNumber,
      linking: {
        path: 'creation-compte/telephone',
      },
    },
    SetPhoneValidationCode: {
      screen: SetPhoneValidationCode,
      linking: {
        path: 'creation-compte/code-de-validation-telephone',
      },
    },
    PhoneValidationTooManyAttempts: {
      screen: PhoneValidationTooManyAttempts,
      linking: {
        path: 'creation-compte/code-de-validation-trop-d-essais',
      },
    },
    PhoneValidationTooManySMSSent: {
      screen: PhoneValidationTooManySMSSent,
      linking: {
        path: 'creation-compte/code-de-validation-trop-de-sms',
      },
    },
    SetName: {
      screen: SetName,
      linking: {
        path: 'creation-profil/nom-prenom',
      },
    },
    SetCity: {
      screen: SetCity,
      linking: {
        path: 'creation-profil/ville',
      },
    },
    SetAddress: {
      screen: SetAddress,
      linking: {
        path: 'creation-profil/adresse',
      },
    },
    SetStatus: {
      screen: SetStatus,
      linking: {
        path: 'verification-identite/profil/statut',
      },
    },
    SetProfileBookingError: {
      screen: SetProfileBookingError,
      linking: {
        path: 'verification-identite/profil/statut/erreur',
      },
    },
    ProfileInformationValidationCreate: {
      screen: ProfileInformationValidationCreate,
      linking: {
        path: 'verification-identite/profil/validation-informations',
      },
    },
    UbbleWebview: {
      screen: UbbleWebview,
      linking: {
        path: 'identification/verification-manuelle-piece-identite',
      },
    },
    EduConnectForm: {
      screen: EduConnectForm,
      linking: {
        path: 'educonnect-formulaire',
      },
    },
    EduConnectValidation: {
      screen: EduConnectValidation,
      linking: {
        path: 'educonnect/validation',
      },
    },
    IdentityCheckEnd: {
      screen: IdentityCheckEnd,
      linking: {
        path: 'verification-identite/fin',
      },
    },
    IdentityCheckUnavailable: {
      screen: IdentityCheckUnavailable,
      linking: {
        path: 'verification-identite/verification-indisponible',
      },
    },
    IdentityCheckPending: {
      screen: IdentityCheckPending,
      linking: {
        path: 'verification-identite/demande-en-attente',
      },
    },
    IdentityCheckDMS: {
      screen: IdentityCheckDMS,
      linking: {
        path: 'verification-identite/demarches-simplifiees',
      },
    },
    IdentificationFork: {
      screen: IdentificationFork,
      linking: {
        path: 'identification/fourche',
      },
    },
    IdentityCheckHonor: {
      screen: IdentityCheckHonor,
      linking: {
        path: 'confirmation',
      },
    },
    BeneficiaryRequestSent: {
      screen: BeneficiaryRequestSent,
      linking: {
        path: 'demande-beneficiaire-envoyee',
      },
    },
    BeneficiaryAccountCreated: {
      screen: BeneficiaryAccountCreated,
      linking: {
        path: 'creation-compte/confirmation-beneficiaire',
      },
    },
    EduConnectErrors: {
      screen: EduConnectErrors,
      linking: {
        path: 'educonnect/erreur',
      },
    },
    DMSIntroduction: {
      screen: DMSIntroduction,
      linking: {
        path: 'identification/redirection-demarches-simplifiees',
      },
    },
    ExpiredOrLostID: {
      screen: ExpiredOrLostID,
      linking: {
        path: 'identification/document-identite-perdu-ou-expire',
      },
    },
    SelectIDOrigin: {
      screen: SelectIDOrigin,
      linking: {
        path: 'identification/origine-document-identite',
      },
    },
    SelectIDStatus: {
      screen: SelectIDStatus,
      linking: {
        path: 'identification/statut-document-identite',
      },
    },
    SelectPhoneStatus: {
      screen: SelectPhoneStatus,
      linking: {
        path: 'identification/statut-telephone',
      },
    },
    ComeBackLater: {
      screen: ComeBackLater,
      linking: {
        path: 'identification/reviens-plus-tard',
      },
    },
    // BonificationIntroduction: {
    //   screen: BonificationIntroduction,
    //   linking: {
    //     path: 'bonification/introduction',
    //   },
    // },
    BonificationNames: {
      screen: BonificationNames,
      linking: {
        path: 'bonification/noms',
      },
    },
    BonificationTitle: {
      screen: BonificationTitle,
      linking: {
        path: 'bonification/civilite',
      },
    },
    BonificationBirthDate: {
      screen: BonificationBirthDate,
      linking: {
        path: 'bonification/date-de-naissance',
      },
    },
    BonificationBirthPlace: {
      screen: BonificationBirthPlace,
      linking: {
        path: 'bonification/lieu-de-naissance',
      },
    },
    BonificationRecap: {
      screen: BonificationRecap,
      linking: {
        path: 'bonification/resume',
      },
    },
    BonificationError: {
      screen: BonificationError,
      linking: {
        path: 'bonification/erreur',
      },
    },
    BonificationGranted: {
      screen: BonificationGranted,
      linking: {
        path: 'bonification/accordee',
      },
    },
    BonificationRefused: {
      screen: BonificationRefused,
      linking: {
        path: 'bonification/refuse',
      },
    },
  },
}

export const SubscriptionStackNavigator = createNativeStackNavigator(
  subscriptionStackNavigatorDefinition
)

const SubscriptionScreen = createComponentForStaticNavigation(
  SubscriptionStackNavigator,
  'Subscription'
)

export default SubscriptionScreen
