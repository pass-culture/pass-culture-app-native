import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { env } from 'libs/environment/fixtures'
import { GoogleOAuthProvider } from 'libs/react-native-google-sso/GoogleOAuthProvider'

// @ts-ignore import is unresolved
// eslint-disable-next-line import/no-unresolved

import { SSOButtonBase } from './SSOButtonBase'

const meta: Meta<typeof SSOButtonBase> = {
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

type Story = StoryObj<typeof SSOButtonBase>

export const Login: Story = {
  render: (props) => <SSOButtonBase {...props} />,
  args: {
    type: 'login',
  },
}

export const Signup: Story = {
  render: (props) => <SSOButtonBase {...props} />,
  args: {
    type: 'signup',
  },
}
