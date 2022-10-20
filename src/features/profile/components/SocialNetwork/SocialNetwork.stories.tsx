import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { SocialNetwork } from 'features/profile/components/SocialNetwork/SocialNetwork'
import { theme } from 'theme'

export default {
  title: 'Features/Profile/SocialNetwork',
  component: SocialNetwork,
} as ComponentMeta<typeof SocialNetwork>

// TODO(PC-17931): Fix those stories
const Default: ComponentStory<typeof SocialNetwork> = () => <SocialNetwork />

Default.parameters = {
  chromatic: {
    viewports: [theme.breakpoints.md, theme.breakpoints.lg, theme.breakpoints.xl],
  },
}
