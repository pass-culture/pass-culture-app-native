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
    (Story: React.ComponentType) => (
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

// TODO(PC-28525): the story even exported is not present in Storybook
export const Login: Story = {
  render: (props: React.ComponentProps<typeof SSOButtonBase>) => <SSOButtonBase {...props} />,
  args: {
    type: 'login',
  },
}

// TODO(PC-28525): the story even exported is not present in Storybook
export const Signup: Story = {
  render: (props: React.ComponentProps<typeof SSOButtonBase>) => <SSOButtonBase {...props} />,
  args: {
    type: 'signup',
  },
}
