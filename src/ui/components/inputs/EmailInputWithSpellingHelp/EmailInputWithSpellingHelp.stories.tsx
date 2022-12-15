import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { EmailInputWithSpellingHelp } from './EmailInputWithSpellingHelp'

export default {
  title: 'ui/forms/emailInputWithSpellingHelp',
  component: EmailInputWithSpellingHelp,
} as ComponentMeta<typeof EmailInputWithSpellingHelp>

const Template: ComponentStory<typeof EmailInputWithSpellingHelp> = (props) => (
  <EmailInputWithSpellingHelp {...props} />
)
export const input = Template.bind({})
input.args = {
  args,
}
