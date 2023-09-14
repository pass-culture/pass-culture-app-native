import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { CreditStatus } from 'features/tutorial/enums'

import { CreditStatusTag } from './CreditStatusTag'

const meta: ComponentMeta<typeof CreditStatusTag> = {
  title: 'features/tutorial/CreditStatusTag',
  component: CreditStatusTag,
}
export default meta

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
