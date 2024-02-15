import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { IconRetryStep } from 'features/identityCheck/components/IconRetryStep'
import { IconStepDone } from 'features/identityCheck/components/IconStepDone'
import { theme } from 'theme'
import { StepButton } from 'ui/components/StepButton/StepButton'
import { StepButtonState } from 'ui/components/StepButton/types'
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

const meta: ComponentMeta<typeof StepButton> = {
  title: 'ui/StepButton',
  component: StepButton,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const Template: ComponentStory<typeof StepButton> = (props) => <StepButton {...props} />

export const Default = Template.bind({})
Default.args = {
  step: {
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
  step: {
    stepState: StepButtonState.DISABLED,
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
  step: {
    stepState: StepButtonState.RETRY,
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
  step: {
    stepState: StepButtonState.COMPLETED,
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
