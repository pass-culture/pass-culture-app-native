import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { env } from 'libs/environment/__mocks__/envFixtures'
import { GoogleOAuthProvider } from 'libs/react-native-google-sso/GoogleOAuthProvider'

// @ts-ignore import is unresolved
// eslint-disable-next-line import/no-unresolved
import { useQueryDecorator } from '/.storybook/mocks/react-query'

import { SSOButton } from './SSOButton'

const meta: ComponentMeta<typeof SSOButton> = {
  title: 'Features/auth/SSOButton',
  component: SSOButton,
  decorators: [
    useQueryDecorator,
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

const Template: ComponentStory<typeof SSOButton> = (props) => <SSOButton {...props} />

export const Login = Template.bind({})
Login.args = {
  type: 'login',
}

export const Signup = Template.bind({})
Signup.args = {
  type: 'signup',
}
