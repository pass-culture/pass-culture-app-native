import { Meta } from '@storybook/react'
import React from 'react'

import { StepButtonState } from 'ui/components/StepButton/types'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { BicolorAroundMe } from 'ui/svg/icons/BicolorAroundMe'
import { Email } from 'ui/svg/icons/Email'

import { StepCard } from './StepCard'

const meta: Meta<typeof StepCard> = {
  title: 'features/profile/StepCard',
  component: StepCard,
}
export default meta

const baseProps = {
  subtitle:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ultricies non ante a egestas. Aliquam sed efficitur risus. Cras ut gravida quam, quis venenatis turpis. ',
}

const variantConfig: Variants<typeof StepCard> = [
  {
    label: 'StepCard',
    props: {
      ...baseProps,
      title: 'StepCard',
      icon: <BicolorAroundMe />,
      type: StepButtonState.CURRENT,
    },
  },
  {
    label: 'Disabled StepCard',
    props: {
      ...baseProps,
      title: 'Disable StepCard',
      icon: <Email />,
      type: StepButtonState.DISABLED,
    },
  },
  {
    label: 'Done StepCard',
    props: {
      ...baseProps,
      title: 'Done StepCard',
      icon: <Email />,
      type: StepButtonState.COMPLETED,
    },
  },
]

const Template: VariantsStory<typeof StepCard> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={StepCard} defaultProps={{ ...args }} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'StepCard'
