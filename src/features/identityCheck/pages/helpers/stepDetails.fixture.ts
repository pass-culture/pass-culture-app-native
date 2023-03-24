import {
  IdentityCheckStepNewStepper,
  StepButtonState,
  StepDetails,
} from 'features/identityCheck/types'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'
import { BicolorSmartphone } from 'ui/svg/icons/BicolorSmartphone'

export const stepsDetailsFixture: StepDetails[] = [
  {
    name: IdentityCheckStepNewStepper.PHONE_VALIDATION,
    icon: {
      disabled: BicolorSmartphone,
      current: BicolorSmartphone,
      completed: BicolorSmartphone,
    },
    screens: ['SetPhoneNumber'],
    title: 'Numéro de téléphone',
    stepState: StepButtonState.COMPLETED,
  },
  {
    name: IdentityCheckStepNewStepper.IDENTIFICATION,
    icon: {
      disabled: BicolorIdCard,
      current: BicolorIdCard,
      completed: BicolorSmartphone,
    },
    screens: ['BeneficiaryRequestSent'],
    title: 'Identification',
    stepState: StepButtonState.CURRENT,
  },
  {
    name: IdentityCheckStepNewStepper.PROFILE,
    title: 'Profil',
    icon: {
      disabled: BicolorProfile,
      current: BicolorProfile,
      completed: BicolorProfile,
    },
    screens: [],
    stepState: StepButtonState.DISABLED,
  },
  {
    name: IdentityCheckStepNewStepper.CONFIRMATION,
    title: 'Confirmation',
    icon: {
      disabled: BicolorProfile,
      current: BicolorProfile,
      completed: BicolorProfile,
    },
    screens: [],
    stepState: StepButtonState.DISABLED,
  },
]
