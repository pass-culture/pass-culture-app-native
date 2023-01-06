import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { CreditStatus } from 'features/onboarding/types'

import { CreditBlockIcon } from './CreditBlockIcon'

export default {
  title: 'features/onboarding/CreditBlockIcon',
  component: CreditBlockIcon,
} as ComponentMeta<typeof CreditBlockIcon>

const Template: ComponentStory<typeof CreditBlockIcon> = (props) => <CreditBlockIcon {...props} />

export const Gone = Template.bind({})
Gone.args = {
  status: CreditStatus.GONE,
}

const ANIMATION_DELAY = 2
export const Ongoing = Template.bind({})
Ongoing.args = {
  status: CreditStatus.ONGOING,
}
Ongoing.parameters = {
  // Wait for animation to finish before snapshot
  chromatic: { delay: ANIMATION_DELAY },
}

export const Coming = Template.bind({})
Coming.args = {
  status: CreditStatus.COMING,
}
