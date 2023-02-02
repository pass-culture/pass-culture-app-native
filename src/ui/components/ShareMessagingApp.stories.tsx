import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { ShareMessagingApp } from 'ui/components/ShareMessagingApp'
import { Network } from 'ui/components/ShareMessagingApp'

export default {
  title: 'ui/ShareMessagingApp',
  component: ShareMessagingApp,
} as ComponentMeta<typeof ShareMessagingApp>

const Template: ComponentStory<typeof ShareMessagingApp> = (args) => <ShareMessagingApp {...args} />

export const Default = Template.bind({})
Default.args = {
  network: Network.instagram,
  onPress: async () => {
    return
  },
}
