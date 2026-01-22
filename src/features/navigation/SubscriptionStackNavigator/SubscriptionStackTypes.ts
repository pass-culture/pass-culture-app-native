import { BonificationRefusedType } from 'features/bonification/pages/BonificationRefused'
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
  ActivationProfileRecap?: ProfileScreenType
  // Identification
  ComeBackLater: undefined
  DMSIntroduction?: { isForeignDMSInformation: boolean }
  ExpiredOrLostID: undefined
  UbbleWebview?: { identificationUrl: string }
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
  BonificationBirthDate: undefined
  BonificationBirthPlace: undefined
  BonificationError: undefined
  BonificationRequiredInformation: undefined
  BonificationExplanations: undefined
  BonificationNames: undefined
  BonificationRecap: undefined
  BonificationRefused?: { bonificationRefusedType: BonificationRefusedType }
  BonificationTitle: undefined
} & CulturalSurveyRootStackParamList

export type SubscriptionStackRouteName = keyof SubscriptionStackParamList
