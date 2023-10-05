import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { EmailAttemptsLeft } from './EmailAttemptsLeft'

const meta: ComponentMeta<typeof EmailAttemptsLeft> = {
  title: 'features/auth/EmailAttemptsLeft',
  component: EmailAttemptsLeft,
}
export default meta

const Template: ComponentStory<typeof EmailAttemptsLeft> = (props) => (
  <EmailAttemptsLeft {...props} />
)
export const MultipleAttempts = Template.bind({})
MultipleAttempts.args = {
  attemptsLeft: 2,
}
export const LastAttempt = Template.bind({})
LastAttempt.args = {
  attemptsLeft: 1,
}
