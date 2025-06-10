import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react'
import React from 'react'

import { IconRetryStep } from 'features/identityCheck/components/IconRetryStep'
import { IconStepDone } from 'features/identityCheck/components/IconStepDone'
import { theme } from 'theme'
import { StepButton } from 'ui/components/StepButton/StepButton'
import { StepButtonState } from 'ui/components/StepButton/types'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { IdCard } from 'ui/svg/icons/IdCard'
import { AccessibleIcon } from 'ui/svg/icons/types'

const DisabledIdCardIcon: React.FC<AccessibleIcon> = () => (
  <IdCard size={24} color={theme.designSystem.color.icon.subtle} testID="DisabledIdCardIcon" />
)

const meta: Meta<typeof StepButton> = {
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

const icon = {
  disabled: DisabledIdCardIcon,
  current: IdCard,
  completed: () => <IconStepDone Icon={IdCard} testID="identification-step-done" />,
  retry: () => <IconRetryStep Icon={IdCard} testID="identification-retry-step" />,
}

const variantConfig: Variants<typeof StepButton> = [
  {
    label: 'StepButton default',
    props: {
      step: {
        stepState: StepButtonState.CURRENT,
        title: 'Identification',
        icon,
      },
    },
  },
  {
    label: 'StepButton disabled step',
    props: {
      step: {
        stepState: StepButtonState.DISABLED,
        title: 'Identification',
        icon,
      },
    },
  },
  {
    label: 'StepButton retry step',
    props: {
      step: {
        stepState: StepButtonState.RETRY,
        title: 'Identification',
        subtitle: 'Réessaie avec ta pièce d’identité en t’assurant qu’elle soit lisible.',
        icon,
      },
    },
  },
  {
    label: 'StepButton completed step',
    props: {
      step: {
        stepState: StepButtonState.COMPLETED,
        title: 'Identification',
        icon,
      },
    },
  },
]

export const Template: VariantsStory<typeof StepButton> = {
  name: 'StepButton',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={StepButton} defaultProps={{ ...props }} />
  ),
}
