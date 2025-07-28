import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { StepExtendedDetails, IdentityCheckStep } from 'features/identityCheck/types'
import { StepButtonState } from 'ui/components/StepButton/types'
import { IdCard } from 'ui/svg/icons/IdCard'
import { Profile } from 'ui/svg/icons/Profile'
import { Smartphone } from 'ui/svg/icons/Smartphone'

export const stepsDetailsFixture: StepExtendedDetails[] = [
  {
    name: IdentityCheckStep.PHONE_VALIDATION,
    icon: {
      disabled: Smartphone,
      current: Smartphone,
      completed: Smartphone,
      retry: Smartphone,
    },
    firstScreen: 'SetPhoneNumber',
    title: 'Numéro de téléphone',
    stepState: StepButtonState.COMPLETED,
    firstScreenType: ProfileTypes.IDENTITY_CHECK,
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
    firstScreenType: ProfileTypes.IDENTITY_CHECK,
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
    firstScreenType: ProfileTypes.IDENTITY_CHECK,
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
    firstScreenType: ProfileTypes.IDENTITY_CHECK,
  },
]
