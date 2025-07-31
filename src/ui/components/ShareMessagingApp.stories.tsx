import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Network } from 'libs/share/types'
import { ShareMessagingApp } from 'ui/components/ShareMessagingApp'

const meta: Meta<typeof ShareMessagingApp> = {
  title: 'ui/share/ShareMessagingApp',
  component: ShareMessagingApp,
}
export default meta

type Story = StoryObj<typeof ShareMessagingApp>

export const Default: Story = {
  render: (args) => <ShareMessagingApp {...args} />,
  name: 'ShareMessagingApp',
  args: {
    network: Network.instagram,
    onPress: async () => {
      return
    },
  },
}
