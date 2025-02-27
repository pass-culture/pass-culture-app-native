import { StoryObj, Meta } from '@storybook/react'
import React from 'react'

import { SocialNetwork } from 'features/profile/components/SocialNetwork/SocialNetwork'
import { theme } from 'theme'

const meta: Meta<typeof SocialNetwork> = {
  title: 'Features/Profile/SocialNetwork',
  component: SocialNetwork,
}
export default meta

// TODO(PC-17931): Fix those stories
const Default: StoryObj<typeof SocialNetwork> = () => <SocialNetwork />

Default.parameters = {
  chromatic: {
    viewports: [theme.breakpoints.md, theme.breakpoints.lg, theme.breakpoints.xl],
  },
}
