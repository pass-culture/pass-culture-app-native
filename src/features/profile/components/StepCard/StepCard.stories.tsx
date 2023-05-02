import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { BicolorAroundMe } from 'ui/svg/icons/BicolorAroundMe'
import { Email } from 'ui/svg/icons/Email'

import { StepCard, StepCardType } from './StepCard'

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
  type: StepCardType.ACTIVE,
}

export const DisabledStepCard = Template.bind({})
DisabledStepCard.args = {
  title: 'Disable StepCard',
  icon: <Email />,
  subtitle:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ultricies non ante a egestas. Aliquam sed efficitur risus. Cras ut gravida quam, quis venenatis turpis. ',
  type: StepCardType.DISABLED,
}

export const DoneStepCard = Template.bind({})
DoneStepCard.args = {
  title: 'Done StepCard',
  icon: <Email />,
  subtitle:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ultricies non ante a egestas. Aliquam sed efficitur risus. Cras ut gravida quam, quis venenatis turpis. ',
  type: StepCardType.DONE,
}
