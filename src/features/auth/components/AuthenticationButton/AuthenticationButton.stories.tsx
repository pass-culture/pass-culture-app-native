import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { AuthenticationButton } from './AuthenticationButton'

export default {
  title: 'Features/Auth/LogInButton',
  component: AuthenticationButton,
} as ComponentMeta<typeof AuthenticationButton>

const Template: ComponentStory<typeof AuthenticationButton> = (props) => (
  <AuthenticationButton {...props} />
)

// TODO(PC-17931): Fix those stories
const Login = Template.bind({})
Login.storyName = 'LoginButton'
Login.args = {
  type: 'login',
}

const Signup = Template.bind({})
Signup.storyName = 'SignupButton'
Signup.args = {
  type: 'signup',
}
