import { StepExtendedDetails, IdentityCheckStep } from 'features/identityCheck/types'
import { StepButtonState } from 'ui/components/StepButton/types'
import { BicolorSmartphone } from 'ui/svg/icons/BicolorSmartphone'
import { IdCard } from 'ui/svg/icons/IdCard'
import { Profile } from 'ui/svg/icons/Profile'

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
      disabled: IdCard,
      current: IdCard,
      completed: IdCard,
      retry: IdCard,
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
      disabled: Profile,
      current: Profile,
      completed: Profile,
      retry: Profile,
    },
    firstScreen: 'SetName',
    stepState: StepButtonState.DISABLED,
  },
  {
    name: IdentityCheckStep.CONFIRMATION,
    title: 'Confirmation',
    icon: {
      disabled: Profile,
      current: Profile,
      completed: Profile,
      retry: Profile,
    },
    firstScreen: 'IdentityCheckEnd',
    stepState: StepButtonState.DISABLED,
  },
]
