import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { StepButtonState } from 'ui/components/StepButton/types'
import { BicolorAroundMe } from 'ui/svg/icons/BicolorAroundMe'
import { Email } from 'ui/svg/icons/Email'

import { StepCard } from './StepCard'

const meta: ComponentMeta<typeof StepCard> = {
  title: 'features/profile/StepCard',
  component: StepCard,
}
export default meta

const Template: ComponentStory<typeof StepCard> = (props) => <StepCard {...props} />
export const Default = Template.bind({})
Default.args = {
  title: 'Default',
  subtitle:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ultricies non ante a egestas. Aliquam sed efficitur risus. Cras ut gravida quam, quis venenatis turpis. ',
  icon: <BicolorAroundMe />,
  type: StepButtonState.CURRENT,
}

export const DisabledStepCard = Template.bind({})
DisabledStepCard.args = {
  title: 'Disable StepCard',
  icon: <Email />,
  subtitle:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ultricies non ante a egestas. Aliquam sed efficitur risus. Cras ut gravida quam, quis venenatis turpis. ',
  type: StepButtonState.DISABLED,
}

export const DoneStepCard = Template.bind({})
DoneStepCard.args = {
  title: 'Done StepCard',
  icon: <Email />,
  subtitle:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ultricies non ante a egestas. Aliquam sed efficitur risus. Cras ut gravida quam, quis venenatis turpis. ',
  type: StepButtonState.COMPLETED,
}
