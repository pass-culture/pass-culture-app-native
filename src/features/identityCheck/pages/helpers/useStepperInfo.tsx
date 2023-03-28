import React from 'react'

import { IdentityCheckMethod } from 'api/gen'
import { useGetStepperInfo } from 'features/identityCheck/api/useGetStepperInfo'
import { usePhoneValidationRemainingAttempts } from 'features/identityCheck/api/usePhoneValidationRemainingAttempts'
import { IconStepDone } from 'features/identityCheck/components/IconStepDone'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { mapStepsDetails } from 'features/identityCheck/pages/helpers/mapStepsDetails'
import { IdentityCheckStep, StepConfig, StepDetails } from 'features/identityCheck/types'
import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'
import { theme } from 'theme'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { BicolorLegal } from 'ui/svg/icons/BicolorLegal'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'
import { BicolorSmartphone } from 'ui/svg/icons/BicolorSmartphone'
import { AccessibleIcon } from 'ui/svg/icons/types'

// hook as it can be dynamic depending on subscription step
export const useStepperInfo = (): StepDetails[] => {
  const { profile, identification } = useSubscriptionContext()
  const hasSchoolTypes = profile.hasSchoolTypes
  const { remainingAttempts } = usePhoneValidationRemainingAttempts()
  const { stepToDisplay } = useGetStepperInfo()

  const educonnectFlow: (keyof SubscriptionRootStackParamList)[] = [
    'IdentityCheckEduConnect',
    'IdentityCheckEduConnectForm',
    'IdentityCheckValidation',
  ]

  const ubbleFlow: (keyof SubscriptionRootStackParamList)[] = ['SelectIDOrigin']

  const stepsConfig: StepConfig[] = [
    {
      name: IdentityCheckStep.PROFILE,
      icon: {
        disabled: DisabledProfileIcon,
        current: BicolorProfile,
        completed: () => <IconStepDone Icon={BicolorProfile} testID="profile-step-done" />,
      },
      screens: hasSchoolTypes
        ? [
            'SetName',
            'IdentityCheckCity',
            'IdentityCheckAddress',
            'IdentityCheckStatus',
            'IdentityCheckSchoolType',
          ]
        : ['SetName', 'IdentityCheckCity', 'IdentityCheckAddress', 'IdentityCheckStatus'],
    },
    {
      name: IdentityCheckStep.IDENTIFICATION,
      icon: {
        disabled: DisabledIdCardIcon,
        current: BicolorIdCard,
        completed: () => <IconStepDone Icon={BicolorIdCard} testID="identification-step-done" />,
      },
      screens:
        identification.method === IdentityCheckMethod.educonnect ? educonnectFlow : ubbleFlow,
    },
    {
      name: IdentityCheckStep.CONFIRMATION,
      icon: {
        disabled: DisabledConfirmationIcon,
        current: BicolorLegal,
        completed: () => <IconStepDone Icon={BicolorLegal} testID="confirmation-step-done" />,
      },
      screens: ['IdentityCheckHonor', 'BeneficiaryRequestSent'],
    },
    {
      name: IdentityCheckStep.PHONE_VALIDATION,
      icon: {
        disabled: DisabledSmartphoneIcon,
        current: BicolorSmartphone,
        completed: () => (
          <IconStepDone Icon={BicolorSmartphone} testID="phone-validation-step-done" />
        ),
      },
      screens:
        remainingAttempts === 0
          ? ['PhoneValidationTooManySMSSent']
          : ['SetPhoneNumber', 'SetPhoneValidationCode'],
    },
  ]

  const stepsDetails = mapStepsDetails(stepToDisplay, stepsConfig)

  return stepsDetails
}

const DisabledSmartphoneIcon: React.FC<AccessibleIcon> = () => (
  <BicolorSmartphone
    size={24}
    color={theme.colors.greyMedium}
    color2={theme.colors.greyMedium}
    testID="DisabledSmartphoneIcon"
  />
)
const DisabledProfileIcon: React.FC<AccessibleIcon> = () => (
  <BicolorProfile
    size={24}
    color={theme.colors.greyMedium}
    color2={theme.colors.greyMedium}
    testID="DisabledProfileIcon"
  />
)
const DisabledIdCardIcon: React.FC<AccessibleIcon> = () => (
  <BicolorIdCard
    size={24}
    color={theme.colors.greyMedium}
    color2={theme.colors.greyMedium}
    testID="DisabledIdCardIcon"
  />
)
const DisabledConfirmationIcon: React.FC<AccessibleIcon> = () => (
  <BicolorLegal
    size={24}
    color={theme.colors.greyMedium}
    color2={theme.colors.greyMedium}
    testID="DisabledConfirmationIcon"
  />
)
