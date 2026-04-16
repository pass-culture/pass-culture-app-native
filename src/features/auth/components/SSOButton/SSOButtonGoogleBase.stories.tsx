// eslint-disable-next-line no-restricted-imports
import { GoogleOAuthProvider } from '@react-oauth/google'
import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { env } from 'libs/environment/fixtures'
import { Variants, VariantsStory, VariantsTemplate } from 'ui/storybook/VariantsTemplate'

import { SSOButtonGoogleBase } from './SSOButtonGoogleBase'

const meta: Meta<typeof SSOButtonGoogleBase> = {
  title: 'Features/auth/SSOButton',
  component: SSOButtonGoogleBase,
  decorators: [
    (Story) => (
      // @ts-expect-error - type incompatibility with React 19
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

const variantConfig: Variants<typeof SSOButtonGoogleBase> = [
  {
    label: 'SSOButton Login',
    props: { type: 'login' },
  },
  {
    label: 'SSOButton Signup',
    props: { type: 'signup' },
  },
]

export const Template: VariantsStory<typeof SSOButtonGoogleBase> = {
  name: 'SSOButton',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={SSOButtonGoogleBase}
      defaultProps={props}
    />
  ),
}
