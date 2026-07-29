import { createComponentForStaticNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { BonificationBirthDate } from 'features/bonification/pages/BonificationBirthDate'
import { BonificationBirthPlace } from 'features/bonification/pages/BonificationBirthPlace'
import { BonificationDisabilityRefused } from 'features/bonification/pages/BonificationDisabilityRefused'
import { BonificationError } from 'features/bonification/pages/BonificationError'
import { BonificationExplanations } from 'features/bonification/pages/BonificationExplanations'
import { BonificationFamilyQuotientRefused } from 'features/bonification/pages/BonificationFamilyQuotientRefused'
import { BonificationNames } from 'features/bonification/pages/BonificationNames'
import { BonificationRecap } from 'features/bonification/pages/BonificationRecap'
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
      linking: { path: 'questionnaire-pratiques-initiales/introduction' },
      options: { title: 'Questionnaire pratiques culturelles - Introduction' },
    },
    CulturalSurveyQuestions: {
      screen: CulturalSurveyQuestions,
      if: useIsSignedIn,
      linking: { path: 'questionnaire-pratiques-initiales/questions' },
      options: { title: 'Questionnaire pratiques culturelles - Questions' },
    },
    CulturalSurveyThanks: {
      screen: CulturalSurveyThanks,
      if: useIsSignedIn,
      linking: { path: 'questionnaire-pratiques-initiales/merci' },
      options: { title: 'Questionnaire pratiques culturelles - Merci' },
    },
    FAQWebview: {
      screen: FAQWebview,
      linking: { path: 'questionnaire-pratiques-initiales/foire-aux-questions' },
      options: { title: 'Questionnaire pratiques culturelles - FAQ' },
    },
    Stepper: {
      screen: Stepper,
      if: useIsSignedIn,
      linking: { path: 'verification-identite' },
      options: { title: 'Vérification d’identité' },
    },
    DisableActivation: {
      screen: DisableActivation,
      linking: { path: 'creation-compte/desactivation' },
      options: { title: 'Création de compte - Désactivation' },
    },
    SetPhoneNumberWithoutValidation: {
      screen: SetPhoneNumberWithoutValidation,
      if: useIsSignedIn,
      linking: { path: 'creation-compte/telephone-sans-validation' },
      options: { title: 'Création de compte - Téléphone sans validation' },
    },
    SetName: {
      screen: SetName,
      if: useIsSignedIn,
      linking: { path: 'creation-profil/nom-prenom' },
      options: { title: 'Création du profil - Nom et prénom' },
    },
    SetCity: {
      screen: SetCity,
      if: useIsSignedIn,
      linking: { path: 'creation-profil/ville' },
      options: { title: 'Création du profil - Ville' },
    },
    SetAddress: {
      screen: SetAddress,
      if: useIsSignedIn,
      linking: { path: 'creation-profil/adresse' },
      options: { title: 'Création du profil - Adresse' },
    },
    SetPhoneNumber: {
      screen: SetPhoneNumber,
      if: useIsSignedIn,
      linking: { path: 'creation-profil/telephone' },
      options: { title: 'Création du profil - Téléphone' },
    },
    SetStatus: {
      screen: SetStatus,
      if: useIsSignedIn,
      linking: { path: 'verification-identite/profil/statut' },
      options: { title: 'Vérification d’identité - Statut' },
    },
    ActivationProfileRecap: {
      screen: ActivationProfileRecap,
      if: useIsSignedIn,
      linking: { path: 'verification-identite/profil/recapitulatif' },
      options: { title: 'Vérification d’identité - Récapitulatif' },
    },
    SetProfileBookingError: {
      screen: SetProfileBookingError,
      if: useIsSignedIn,
      linking: { path: 'verification-identite/profil/statut/erreur' },
      options: { title: 'Vérification d’identité - Erreur' },
    },
    ProfileInformationValidationCreate: {
      screen: ProfileInformationValidationCreate,
      if: useIsSignedIn,
      linking: { path: 'verification-identite/profil/validation-informations' },
      options: { title: 'Vérification d’identité - Validation des informations' },
    },
    UbbleWebview: {
      screen: UbbleWebview,
      if: useIsSignedIn,
      linking: { path: 'identification/verification-manuelle-piece-identite' },
      options: { title: 'Identification - Vérification de la pièce d’identité' },
    },
    EduConnectForm: {
      screen: EduConnectForm,
      linking: { path: 'educonnect-formulaire' },
      options: { title: 'EduConnect - Formulaire' },
    },
    EduConnectValidation: {
      screen: EduConnectValidation,
      linking: { path: 'educonnect/validation' },
      options: { title: 'EduConnect - Validation' },
    },
    IdentityCheckEnd: {
      screen: IdentityCheckEnd,
      if: useIsSignedIn,
      linking: { path: 'verification-identite/fin' },
      options: { title: 'Vérification d’identité - Fin' },
    },
    IdentityCheckUnavailable: {
      screen: IdentityCheckUnavailable,
      if: useIsSignedIn,
      linking: { path: 'verification-identite/verification-indisponible' },
      options: { title: 'Vérification d’identité - Indisponible' },
    },
    IdentityCheckPending: {
      screen: IdentityCheckPending,
      linking: { path: 'verification-identite/demande-en-attente' },
      options: { title: 'Vérification d’identité - Demande en attente' },
    },
    IdentityCheckDMS: {
      screen: IdentityCheckDMS,
      linking: { path: 'verification-identite/demarches-simplifiees' },
      options: { title: 'Vérification d’identité - Démarches Simplifiées' },
    },
    IdentificationFork: {
      screen: IdentificationFork,
      linking: { path: 'identification/fourche' },
      options: { title: 'Identification - Choix du parcours' },
    },
    IdentityCheckHonor: {
      screen: IdentityCheckHonor,
      if: useIsSignedIn,
      linking: { path: 'confirmation' },
      options: { title: 'Déclaration sur l’honneur' },
    },
    BeneficiaryRequestSent: {
      screen: BeneficiaryRequestSent,
      if: useIsSignedIn,
      linking: { path: 'demande-beneficiaire-envoyee' },
      options: { title: 'Demande bénéficiaire envoyée' },
    },
    BeneficiaryAccountCreated: {
      screen: BeneficiaryAccountCreated,
      if: useIsSignedIn,
      linking: { path: 'creation-compte/confirmation-beneficiaire' },
      options: { title: 'Création de compte - Confirmation bénéficiaire' },
    },
    FreeBeneficiaryAccountCreated: {
      screen: FreeBeneficiaryAccountCreated,
      if: useIsSignedIn,
      linking: { path: 'creation-compte/confirmation-beneficiaire-gratuit' },
      options: { title: 'Création de compte - Confirmation bénéficiaire gratuit' },
    },
    EduConnectErrors: {
      screen: EduConnectErrors,
      linking: { path: 'educonnect/erreur' },
      options: { title: 'EduConnect - Erreur' },
    },
    DMSIntroduction: {
      screen: DMSIntroduction,
      linking: { path: 'identification/redirection-demarches-simplifiees' },
      options: { title: 'Identification - Redirection Démarches Simplifiées' },
    },
    ExpiredOrLostID: {
      screen: ExpiredOrLostID,
      linking: { path: 'identification/document-identite-perdu-ou-expire' },
      options: { title: 'Identification - Document perdu ou expiré' },
    },
    SelectIDOrigin: {
      screen: SelectIDOrigin,
      linking: { path: 'identification/origine-document-identite' },
      options: { title: 'Identification - Origine du document' },
    },
    SelectIDStatus: {
      screen: SelectIDStatus,
      linking: { path: 'identification/statut-document-identite' },
      options: { title: 'Identification - Statut du document' },
    },
    SelectPhoneStatus: {
      screen: SelectPhoneStatus,
      linking: { path: 'identification/statut-telephone' },
      options: { title: 'Identification - Statut du téléphone' },
    },
    ComeBackLater: {
      screen: ComeBackLater,
      linking: { path: 'identification/reviens-plus-tard' },
      options: { title: 'Identification - Revenir plus tard' },
    },
    BonificationDisabilityRefused: {
      screen: BonificationDisabilityRefused,
      if: useIsSignedIn,
      linking: { path: 'bonification/refuse-handicap' },
      options: { title: 'Bonus - Refus handicap' },
    },
    BonificationExplanations: {
      screen: BonificationExplanations,
      if: useIsSignedIn,
      linking: { path: 'bonification/explications' },
      options: { title: 'Bonus - Explications' },
    },
    BonificationRequiredInformation: {
      screen: BonificationRequiredInformation,
      if: useIsSignedIn,
      linking: { path: 'bonification/informations-requises' },
      options: { title: 'Bonus - Informations requises' },
    },
    BonificationNames: {
      screen: BonificationNames,
      if: useIsSignedIn,
      linking: { path: 'bonification/noms' },
      options: { title: 'Bonus - Noms' },
    },
    BonificationTitle: {
      screen: BonificationTitle,
      if: useIsSignedIn,
      linking: { path: 'bonification/civilite' },
      options: { title: 'Bonus - Civilité' },
    },
    BonificationBirthDate: {
      screen: BonificationBirthDate,
      if: useIsSignedIn,
      linking: { path: 'bonification/date-de-naissance' },
      options: { title: 'Bonus - Date de naissance' },
    },
    BonificationBirthPlace: {
      screen: BonificationBirthPlace,
      if: useIsSignedIn,
      linking: { path: 'bonification/lieu-de-naissance' },
      options: { title: 'Bonus - Lieu de naissance' },
    },
    BonificationRecap: {
      screen: BonificationRecap,
      if: useIsSignedIn,
      linking: { path: 'bonification/resume' },
      options: { title: 'Bonus - Récapitulatif' },
    },
    BonificationError: {
      screen: BonificationError,
      if: useIsSignedIn,
      linking: { path: 'bonification/erreur' },
      options: { title: 'Bonus - Erreur' },
    },
    BonificationFamilyQuotientRefused: {
      screen: BonificationFamilyQuotientRefused,
      if: useIsSignedIn,
      linking: { path: 'bonification/refuse' },
      options: { title: 'Bonus - Refus quotient familial' },
    },
  },
}

export const AUTH_PROTECTED_SUBSCRIPTION_SCREENS = new Set(
  Object.entries(subscriptionStackNavigatorDefinition.screens).flatMap(
    ([screenName, screenDefinition]) =>
      'if' in screenDefinition && screenDefinition.if === useIsSignedIn ? [screenName] : []
  )
)

export const SubscriptionStackNavigator = createNativeStackNavigator(
  subscriptionStackNavigatorDefinition
)

const SubscriptionScreen = createComponentForStaticNavigation(SubscriptionStackNavigator)

export default SubscriptionScreen
