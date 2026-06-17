import { createComponentForStaticNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { BonificationBirthDate } from 'features/bonification/pages/BonificationBirthDate'
import { BonificationBirthPlace } from 'features/bonification/pages/BonificationBirthPlace'
import { BonificationError } from 'features/bonification/pages/BonificationError'
import { BonificationExplanations } from 'features/bonification/pages/BonificationExplanations'
import { BonificationIncorrectLink } from 'features/bonification/pages/BonificationIncorrectLink'
import { BonificationNames } from 'features/bonification/pages/BonificationNames'
import { BonificationRecap } from 'features/bonification/pages/BonificationRecap'
import { BonificationRefused } from 'features/bonification/pages/BonificationRefused'
import { BonificationRequiredInformation } from 'features/bonification/pages/BonificationRequiredInformation'
import { BonificationTitle } from 'features/bonification/pages/BonificationTitle'
import { CulturalSurveyIntro } from 'features/culturalSurvey/pages/CulturalSurveyIntro'
import { CulturalSurveyQuestions } from 'features/culturalSurvey/pages/CulturalSurveyQuestions'
import { CulturalSurveyThanks } from 'features/culturalSurvey/pages/CulturalSurveyThanks'
import { FAQWebview } from 'features/culturalSurvey/pages/FAQWebview'
import { BeneficiaryAccountCreated } from 'features/identityCheck/pages/confirmation/BeneficiaryAccountCreated'
import { BeneficiaryRequestSent } from 'features/identityCheck/pages/confirmation/BeneficiaryRequestSent'
import { FreeBeneficiaryAccountCreated } from 'features/identityCheck/pages/confirmation/FreeBeneficiaryAccountCreated'
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
import { SetPhoneNumberWithoutValidation } from 'features/identityCheck/pages/phoneValidation/SetPhoneNumberWithoutValidation'
import { ActivationProfileRecap } from 'features/identityCheck/pages/profile/ActivationProfileRecap'
import { ProfileInformationValidationCreate } from 'features/identityCheck/pages/profile/ProfileInformationValidationCreate'
import { SetAddress } from 'features/identityCheck/pages/profile/SetAddress'
import { SetCity } from 'features/identityCheck/pages/profile/SetCity'
import { SetName } from 'features/identityCheck/pages/profile/SetName'
import { SetPhoneNumber } from 'features/identityCheck/pages/profile/SetPhoneNumber'
import { SetProfileBookingError } from 'features/identityCheck/pages/profile/SetProfileBookingError'
import { SetStatus } from 'features/identityCheck/pages/profile/SetStatus'
import { Stepper } from 'features/identityCheck/pages/Stepper'
import { ROOT_NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/navigators/RootNavigator/navigationOptions'
import { useIsSignedIn } from 'features/navigation/navigators/TabNavigator/TabStackNavigator'

const subscriptionStackNavigatorDefinition = {
  screenOptions: ROOT_NAVIGATOR_SCREEN_OPTIONS,
  screens: {
    CulturalSurveyIntro: {
      screen: CulturalSurveyIntro,
      if: useIsSignedIn,
      linking: {
        path: 'questionnaire-pratiques-initiales/introduction',
      },
    },
    CulturalSurveyQuestions: {
      screen: CulturalSurveyQuestions,
      if: useIsSignedIn,
      linking: {
        path: 'questionnaire-pratiques-initiales/questions',
      },
    },
    CulturalSurveyThanks: {
      screen: CulturalSurveyThanks,
      if: useIsSignedIn,
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
      if: useIsSignedIn,
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
      if: useIsSignedIn,
      linking: {
        path: 'creation-compte/telephone-sans-validation',
      },
    },
    SetName: {
      screen: SetName,
      if: useIsSignedIn,
      linking: {
        path: 'creation-profil/nom-prenom',
      },
    },
    SetCity: {
      screen: SetCity,
      if: useIsSignedIn,
      linking: {
        path: 'creation-profil/ville',
      },
    },
    SetAddress: {
      screen: SetAddress,
      if: useIsSignedIn,
      linking: {
        path: 'creation-profil/adresse',
      },
    },
    SetPhoneNumber: {
      screen: SetPhoneNumber,
      if: useIsSignedIn,
      linking: {
        path: 'creation-profil/telephone',
      },
    },
    SetStatus: {
      screen: SetStatus,
      if: useIsSignedIn,
      linking: {
        path: 'verification-identite/profil/statut',
      },
    },
    ActivationProfileRecap: {
      screen: ActivationProfileRecap,
      if: useIsSignedIn,
      linking: {
        path: 'verification-identite/profil/recapitulatif',
      },
    },
    SetProfileBookingError: {
      screen: SetProfileBookingError,
      if: useIsSignedIn,
      linking: {
        path: 'verification-identite/profil/statut/erreur',
      },
    },
    ProfileInformationValidationCreate: {
      screen: ProfileInformationValidationCreate,
      if: useIsSignedIn,
      linking: {
        path: 'verification-identite/profil/validation-informations',
      },
    },
    UbbleWebview: {
      screen: UbbleWebview,
      if: useIsSignedIn,
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
      if: useIsSignedIn,
      linking: {
        path: 'verification-identite/fin',
      },
    },
    IdentityCheckUnavailable: {
      screen: IdentityCheckUnavailable,
      if: useIsSignedIn,
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
      if: useIsSignedIn,
      linking: {
        path: 'confirmation',
      },
    },
    BeneficiaryRequestSent: {
      screen: BeneficiaryRequestSent,
      if: useIsSignedIn,
      linking: {
        path: 'demande-beneficiaire-envoyee',
      },
    },
    BeneficiaryAccountCreated: {
      screen: BeneficiaryAccountCreated,
      if: useIsSignedIn,
      linking: {
        path: 'creation-compte/confirmation-beneficiaire',
      },
    },
    FreeBeneficiaryAccountCreated: {
      screen: FreeBeneficiaryAccountCreated,
      if: useIsSignedIn,
      linking: {
        path: 'creation-compte/confirmation-beneficiaire-gratuit',
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
    BonificationExplanations: {
      screen: BonificationExplanations,
      if: useIsSignedIn,
      linking: {
        path: 'bonification/explications',
      },
    },
    BonificationRequiredInformation: {
      screen: BonificationRequiredInformation,
      if: useIsSignedIn,
      linking: {
        path: 'bonification/informations-requises',
      },
    },
    BonificationNames: {
      screen: BonificationNames,
      if: useIsSignedIn,
      linking: {
        path: 'bonification/noms',
      },
    },
    BonificationTitle: {
      screen: BonificationTitle,
      if: useIsSignedIn,
      linking: {
        path: 'bonification/civilite',
      },
    },
    BonificationBirthDate: {
      screen: BonificationBirthDate,
      if: useIsSignedIn,
      linking: {
        path: 'bonification/date-de-naissance',
      },
    },
    BonificationBirthPlace: {
      screen: BonificationBirthPlace,
      if: useIsSignedIn,
      linking: {
        path: 'bonification/lieu-de-naissance',
      },
    },
    BonificationRecap: {
      screen: BonificationRecap,
      if: useIsSignedIn,
      linking: {
        path: 'bonification/resume',
      },
    },
    BonificationError: {
      screen: BonificationError,
      if: useIsSignedIn,
      linking: {
        path: 'bonification/erreur',
      },
    },
    BonificationIncorrectLink: {
      screen: BonificationIncorrectLink,
      if: useIsSignedIn,
      linking: {
        path: 'bonification/lien-incorrect',
      },
    },
    BonificationRefused: {
      screen: BonificationRefused,
      if: useIsSignedIn,
      linking: {
        path: 'bonification/refuse',
      },
    },
  },
}

export const SubscriptionStackNavigator = createNativeStackNavigator(
  subscriptionStackNavigatorDefinition
)

const SubscriptionScreen = createComponentForStaticNavigation(SubscriptionStackNavigator)

export default SubscriptionScreen
