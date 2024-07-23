import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { env } from 'libs/environment/fixtures'
import { GoogleOAuthProvider } from 'libs/react-native-google-sso/GoogleOAuthProvider'

import { SSOButtonBase } from './SSOButtonBase'

const meta: ComponentMeta<typeof SSOButtonBase> = {
  title: 'Features/auth/SSOButton',
  component: SSOButtonBase,
  decorators: [
    (Story) => (
      <GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID}>
        <Story />
      </GoogleOAuthProvider>
    ),
  ],
  parameters: {
    useQuery: {
      oauthState: { oauthStateToken: 'oauthStateToken' },
    },
  },
}
export default meta

const Template: ComponentStory<typeof SSOButtonBase> = (props) => <SSOButtonBase {...props} />

export const Login = Template.bind({})
Login.args = {
  type: 'login',
}

export const Signup = Template.bind({})
Signup.args = {
  type: 'signup',
}
