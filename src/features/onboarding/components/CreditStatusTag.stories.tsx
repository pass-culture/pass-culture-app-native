import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { CreditStatus, CreditStatusTag } from './CreditStatusTag'

export default {
  title: 'features/onboarding/CreditStatusTag',
  component: CreditStatusTag,
} as ComponentMeta<typeof CreditStatusTag>

const Template: ComponentStory<typeof CreditStatusTag> = (props) => <CreditStatusTag {...props} />

export const Gone = Template.bind({})
Gone.args = {
  status: CreditStatus.GONE,
}

export const Ongoing = Template.bind({})
Ongoing.args = {
  status: CreditStatus.ONGOING,
}

export const Coming = Template.bind({})
Coming.args = {
  status: CreditStatus.COMING,
}
