import { ProfileScreenType } from 'features/identityCheck/pages/profile/types'
import {
  CulturalSurveyRootStackParamList,
  StepperOrigin,
} from 'features/navigation/RootNavigator/types'

export type SubscriptionStackParamList = {
  // Other
  DisableActivation: undefined
  // Stepper
  Stepper: { from: StepperOrigin } | undefined
  // PhoneValidation
  SetPhoneNumberWithoutValidation: undefined
  SetPhoneNumber: undefined
  SetPhoneValidationCode: undefined
  PhoneValidationTooManyAttempts: undefined
  PhoneValidationTooManySMSSent: undefined
  NewSignup: undefined
  // Profile
  ProfileInformationValidationCreate?: ProfileScreenType
  ProfileInformationValidationUpdate: undefined
  SetEmail: undefined
  SetName?: ProfileScreenType
  SetCity?: ProfileScreenType
  SetAddress?: ProfileScreenType
  SetStatus?: ProfileScreenType
  SetProfileBookingError?: { offerId?: number }
  // Identification
  ComeBackLater: undefined
  DMSIntroduction?: { isForeignDMSInformation: boolean }
  ExpiredOrLostID: undefined
  UbbleWebview: undefined
  IdentityCheckEnd: undefined
  IdentityCheckUnavailable?: { withDMS?: boolean }
  EduConnectForm: undefined
  EduConnectValidation?: {
    firstName?: string
    lastName?: string
    dateOfBirth?: string
    logoutUrl?: string
  }
  SelectIDOrigin: undefined
  SelectIDStatus: undefined
  SelectPhoneStatus: undefined
  IdentificationFork: undefined
  // TODO(PC-12433): this duplicate route is required until we solve PC-12433
  Validation: {
    firstName?: string
    lastName?: string
    dateOfBirth?: string
    logoutUrl?: string
  }
  IdentityCheckPending: undefined
  IdentityCheckDMS: undefined
  // Confirmation
  IdentityCheckHonor: undefined
  BeneficiaryRequestSent: undefined
  BeneficiaryAccountCreated: undefined
  // Errors
  EduConnectErrors: { code?: string; logoutUrl?: string }
  EduConnectErrorsPage: { code?: string; logoutUrl?: string }
  // Bonification
  BonificationIntroduction: undefined
  BonificationTitle: undefined
  BonificationNames: undefined
  BonificationBirthDate: undefined
  BonificationBirthPlace: undefined
  BonificationRecap: undefined
  BonificationError: undefined
} & CulturalSurveyRootStackParamList

export type SubscriptionStackRouteName = keyof SubscriptionStackParamList
