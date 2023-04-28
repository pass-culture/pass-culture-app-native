import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { BicolorAroundMe } from 'ui/svg/icons/BicolorAroundMe'

import { StepCard } from './StepCard'

export default {
  title: 'features/profile/StepCard',
  component: StepCard,
} as ComponentMeta<typeof StepCard>

const Template: ComponentStory<typeof StepCard> = (props) => <StepCard {...props} />
export const Default = Template.bind({})
Default.args = {
  title: 'Default',
  subtitle:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ultricies non ante a egestas. Aliquam sed efficitur risus. Cras ut gravida quam, quis venenatis turpis. ',
  icon: <BicolorAroundMe />,
}

export const DisabledStepCard = Template.bind({})
DisabledStepCard.args = {
  title: 'Disable StepCard',
  icon: <BicolorAroundMe />,
  disabled: true,
}
