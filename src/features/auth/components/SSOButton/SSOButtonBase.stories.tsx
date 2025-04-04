import type { Meta } from '@storybook/react'
import React from 'react'

import { env } from 'libs/environment/fixtures'
import { GoogleOAuthProvider } from 'libs/react-native-google-sso/GoogleOAuthProvider'
import { Variants, VariantsStory, VariantsTemplate } from 'ui/storybook/VariantsTemplate'

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

const variantConfig: Variants<typeof SSOButtonBase> = [
  {
    label: 'SSOButton Login',
    props: { type: 'login' },
  },
  {
    label: 'SSOButton Signup',
    props: { type: 'signup' },
  },
]

export const Template: VariantsStory<typeof SSOButtonBase> = {
  name: 'SSOButton',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={SSOButtonBase} defaultProps={props} />
  ),
}
