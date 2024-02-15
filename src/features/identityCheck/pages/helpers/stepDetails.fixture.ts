import { StepExtendedDetails, IdentityCheckStep } from 'features/identityCheck/types'
import { StepButtonState } from 'ui/components/StepButton/types'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'
import { BicolorSmartphone } from 'ui/svg/icons/BicolorSmartphone'

export const stepsDetailsFixture: StepExtendedDetails[] = [
  {
    name: IdentityCheckStep.PHONE_VALIDATION,
    icon: {
      disabled: BicolorSmartphone,
      current: BicolorSmartphone,
      completed: BicolorSmartphone,
      retry: BicolorSmartphone,
    },
    firstScreen: 'SetPhoneNumber',
    title: 'Numéro de téléphone',
    stepState: StepButtonState.COMPLETED,
  },
  {
    name: IdentityCheckStep.IDENTIFICATION,
    icon: {
      disabled: BicolorIdCard,
      current: BicolorIdCard,
      completed: BicolorIdCard,
      retry: BicolorIdCard,
    },
    firstScreen: 'BeneficiaryRequestSent',
    title: 'Identification',
    subtitle: 'Confirme tes informations',
    stepState: StepButtonState.CURRENT,
  },
  {
    name: IdentityCheckStep.PROFILE,
    title: 'Profil',
    icon: {
      disabled: BicolorProfile,
      current: BicolorProfile,
      completed: BicolorProfile,
      retry: BicolorProfile,
    },
    firstScreen: 'SetName',
    stepState: StepButtonState.DISABLED,
  },
  {
    name: IdentityCheckStep.CONFIRMATION,
    title: 'Confirmation',
    icon: {
      disabled: BicolorProfile,
      current: BicolorProfile,
      completed: BicolorProfile,
      retry: BicolorProfile,
    },
    firstScreen: 'IdentityCheckEnd',
    stepState: StepButtonState.DISABLED,
  },
]
