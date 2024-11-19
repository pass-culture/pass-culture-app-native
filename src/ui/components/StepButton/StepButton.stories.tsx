import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { IconRetryStep } from 'features/identityCheck/components/IconRetryStep'
import { IconStepDone } from 'features/identityCheck/components/IconStepDone'
import { theme } from 'theme'
import { StepButton } from 'ui/components/StepButton/StepButton'
import { StepButtonState } from 'ui/components/StepButton/types'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
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

const icon = {
  disabled: DisabledIdCardIcon,
  current: BicolorIdCard,
  completed: () => <IconStepDone Icon={BicolorIdCard} testID="identification-step-done" />,
  retry: () => <IconRetryStep Icon={BicolorIdCard} testID="identification-retry-step" />,
}

const variantConfig: Variants<typeof StepButton> = [
  {
    label: 'StepButton default',
    props: {
      navigateTo: { screen: 'SelectIDOrigin' },
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

const Template: VariantsStory<typeof StepButton> = () => (
  <VariantsTemplate
    variants={variantConfig}
    Component={StepButton}
    defaultProps={{ navigateTo: { screen: 'SelectIDOrigin' } }}
  />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'StepButton'
