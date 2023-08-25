import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { AuthenticationButton } from './AuthenticationButton'

const meta: ComponentMeta<typeof AuthenticationButton> = {
  title: 'Features/auth/LogInButton',
  component: AuthenticationButton,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const Template: ComponentStory<typeof AuthenticationButton> = (props) => (
  <AuthenticationButton {...props} />
)

export const Login = Template.bind({})
Login.args = {
  type: 'login',
}

export const Signup = Template.bind({})
Signup.args = {
  type: 'signup',
}
