import React from 'react'

import {
  SubscriptionStep,
  SubscriptionStepCompletionState,
  SubscriptionStepperResponse,
  SubscriptionStepTitle,
} from 'api/gen'
import { IconStepDone } from 'features/identityCheck/components/IconStepDone'
import { mapStepsDetails } from 'features/identityCheck/pages/helpers/mapStepsDetails'
import {
  IdentityCheckStep,
  StepButtonState,
  StepConfigNewStepper,
  StepDetails,
} from 'features/identityCheck/types'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { BicolorLegal } from 'ui/svg/icons/BicolorLegal'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'
import { BicolorSmartphone } from 'ui/svg/icons/BicolorSmartphone'

const stepsToComplete: SubscriptionStepperResponse['subscriptionStepsToDisplay'] = [
  {
    name: SubscriptionStep['phone-validation'],
    completionState: SubscriptionStepCompletionState.disabled,
    title: SubscriptionStepTitle['Numéro de téléphone'],
    subtitle: 'Sous-titre Numéro de téléphone',
  },
  {
    name: SubscriptionStep['identity-check'],
    completionState: SubscriptionStepCompletionState.current,
    title: SubscriptionStepTitle['Identification'],
    subtitle: 'Sous-titre Identification',
  },
  {
    name: SubscriptionStep['maintenance'],
    completionState: SubscriptionStepCompletionState.completed,
    title: SubscriptionStepTitle['Confirmation'],
    subtitle: 'Maintenance',
  },
  {
    name: SubscriptionStep['honor-statement'],
    completionState: SubscriptionStepCompletionState.retry,
    title: SubscriptionStepTitle['Confirmation'],
    subtitle: 'Confirmation',
  },
]
describe('mapStepsDetails', () => {
  const stepsConfig: StepConfigNewStepper[] = [
    {
      screens: ['SetPhoneNumber'],
      name: IdentityCheckStep.PHONE_VALIDATION,
      icon: {
        disabled: BicolorSmartphone,
        current: BicolorSmartphone,
        completed: () => (
          <IconStepDone Icon={BicolorSmartphone} testID="phone-validation-step-done" />
        ),
      },
    },
    {
      screens: ['SetName'],
      name: IdentityCheckStep.PROFILE,
      icon: {
        disabled: BicolorProfile,
        current: BicolorProfile,
        completed: () => <IconStepDone Icon={BicolorProfile} testID="profile-step-done" />,
      },
    },
    {
      screens: ['SelectIDOrigin'],
      name: IdentityCheckStep.IDENTIFICATION,
      icon: {
        disabled: BicolorIdCard,
        current: BicolorIdCard,
        completed: () => <IconStepDone Icon={BicolorIdCard} testID="identification-step-done" />,
      },
    },
    {
      screens: ['IdentityCheckHonor'],
      name: IdentityCheckStep.CONFIRMATION,
      icon: {
        disabled: BicolorLegal,
        current: BicolorLegal,
        completed: () => <IconStepDone Icon={BicolorLegal} testID="Confirmation-step-done" />,
      },
    },
  ]

  const expectedStepsDetails: StepDetails[] = [
    {
      name: IdentityCheckStep.PHONE_VALIDATION,
      icon: {
        disabled: BicolorSmartphone,
        current: BicolorSmartphone,
        completed: expect.any(Function),
      },
      screens: ['SetPhoneNumber'],
      title: 'Numéro de téléphone',
      stepState: StepButtonState.DISABLED,
    },
    {
      name: IdentityCheckStep.IDENTIFICATION,
      icon: {
        disabled: BicolorIdCard,
        current: BicolorIdCard,
        completed: expect.any(Function),
      },
      screens: ['SelectIDOrigin'],
      title: 'Identification',
      stepState: StepButtonState.CURRENT,
    },
    {
      name: IdentityCheckStep.CONFIRMATION,
      icon: {
        disabled: BicolorLegal,
        current: BicolorLegal,
        completed: expect.any(Function),
      },
      screens: ['IdentityCheckHonor'],
      title: 'Confirmation',
      stepState: StepButtonState.CURRENT,
    },
  ]

  it('should map steps info from the back with steps config from the front ', () => {
    const result = mapStepsDetails(stepsToComplete, stepsConfig)
    expect(result).toEqual(expectedStepsDetails)
  })

  it('should only return steps when the associated config exists in-app', () => {
    const result = mapStepsDetails(stepsToComplete, stepsConfig)
    expect(stepsToComplete.length).toEqual(4)
    expect(result.length).toEqual(3)
  })
})
