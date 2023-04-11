import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { IconRetryStep } from 'features/identityCheck/components/IconRetryStep'
import { IconStepDone } from 'features/identityCheck/components/IconStepDone'
import { StepButton } from 'features/identityCheck/components/StepButton'
import { IdentityCheckStep, StepButtonState } from 'features/identityCheck/types'
import { theme } from 'theme'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { AccessibleIcon } from 'ui/svg/icons/types'

const DisabledIdCardIcon: React.FC<AccessibleIcon> = () => (
  <BicolorIdCard
    size={24}
    color={theme.colors.greyMedium}
    color2={theme.colors.greyMedium}
    testID="DisabledIdCardIcon"
  />
)

export default {
  title: 'ui/StepButton',
  component: StepButton,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
} as ComponentMeta<typeof StepButton>

const Template: ComponentStory<typeof StepButton> = (props) => <StepButton {...props} />

export const Default = Template.bind({})
Default.args = {
  state: StepButtonState.CURRENT,
  step: {
    name: IdentityCheckStep.IDENTIFICATION,
    screens: ['SelectIDOrigin'],
    stepState: StepButtonState.CURRENT,
    title: 'Identification',
    icon: {
      disabled: DisabledIdCardIcon,
      current: BicolorIdCard,
      completed: () => <IconStepDone Icon={BicolorIdCard} testID="identification-step-done" />,
      retry: () => <IconRetryStep Icon={BicolorIdCard} testID="identification-retry-step" />,
    },
  },
  navigateTo: { screen: 'SelectIDOrigin' },
}

export const DisabledStep = Template.bind({})
DisabledStep.args = {
  state: StepButtonState.DISABLED,
  step: {
    stepState: StepButtonState.DISABLED,
    name: IdentityCheckStep.IDENTIFICATION,
    screens: ['SelectIDOrigin'],
    title: 'Identification',
    icon: {
      disabled: DisabledIdCardIcon,
      current: BicolorIdCard,
      completed: () => <IconStepDone Icon={BicolorIdCard} testID="identification-step-done" />,
      retry: () => <IconRetryStep Icon={BicolorIdCard} testID="identification-retry-step" />,
    },
  },
  navigateTo: { screen: 'SelectIDOrigin' },
}
export const RetryStep = Template.bind({})
RetryStep.args = {
  state: StepButtonState.RETRY,
  step: {
    stepState: StepButtonState.RETRY,
    name: IdentityCheckStep.IDENTIFICATION,
    screens: ['SelectIDOrigin'],
    title: 'Identification',
    subtitle: 'Réessaie avec ta pièce d’identité en t’assurant qu’elle soit lisible.',
    icon: {
      disabled: DisabledIdCardIcon,
      current: BicolorIdCard,
      completed: () => <IconStepDone Icon={BicolorIdCard} testID="identification-step-done" />,
      retry: () => <IconRetryStep Icon={BicolorIdCard} testID="identification-retry-step" />,
    },
  },
  navigateTo: { screen: 'SelectIDOrigin' },
}
export const CompletedStep = Template.bind({})
CompletedStep.args = {
  state: StepButtonState.COMPLETED,
  step: {
    stepState: StepButtonState.COMPLETED,
    name: IdentityCheckStep.IDENTIFICATION,
    screens: ['SelectIDOrigin'],
    title: 'Identification',
    icon: {
      disabled: DisabledIdCardIcon,
      current: BicolorIdCard,
      completed: () => <IconStepDone Icon={BicolorIdCard} testID="identification-step-done" />,
      retry: () => <IconRetryStep Icon={BicolorIdCard} testID="identification-retry-step" />,
    },
  },
  navigateTo: { screen: 'SelectIDOrigin' },
}
