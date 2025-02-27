import { StoryObj, Meta } from '@storybook/react'
import React from 'react'

import { env } from 'libs/environment/fixtures'
import { GoogleOAuthProvider } from 'libs/react-native-google-sso/GoogleOAuthProvider'

// @ts-ignore import is unresolved
// eslint-disable-next-line import/no-unresolved
import { useQueryDecorator } from '/.storybook/mocks/react-query'

import { SSOButtonBase } from './SSOButtonBase'

const meta: Meta<typeof SSOButtonBase> = {
  title: 'Features/auth/SSOButton',
  component: SSOButtonBase,
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

const Template: StoryObj<typeof SSOButtonBase> = (props) => <SSOButtonBase {...props} />

// TODO(PC-28525): the storie even exported in not present in Stroybook
const Login = Template.bind({})
Login.args = {
  type: 'login',
}

// TODO(PC-28525): the storie even exported in not present in Stroybook
const Signup = Template.bind({})
Signup.args = {
  type: 'signup',
}
