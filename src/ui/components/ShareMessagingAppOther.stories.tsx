import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { ShareMessagingAppOther } from 'ui/components/ShareMessagingAppOther'

const meta: Meta<typeof ShareMessagingAppOther> = {
  title: 'ui/share/ShareMessagingAppOther',
  component: ShareMessagingAppOther,
}
export default meta

type Story = StoryObj<typeof ShareMessagingAppOther>

export const Default: Story = {
  render: (args) => <ShareMessagingAppOther {...args} />,
  name: 'ShareMessagingAppOther',
  args: {
    onPress: async () => {
      return
    },
  },
}
