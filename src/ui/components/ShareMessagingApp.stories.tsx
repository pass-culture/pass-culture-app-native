import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { ShareMessagingApp } from 'ui/components/ShareMessagingApp'
import { Network } from 'ui/components/ShareMessagingApp'

const meta: ComponentMeta<typeof ShareMessagingApp> = {
  title: 'ui/share/ShareMessagingApp',
  component: ShareMessagingApp,
}
export default meta

const Template: ComponentStory<typeof ShareMessagingApp> = (args) => <ShareMessagingApp {...args} />

export const Default = Template.bind({})
Default.args = {
  network: Network.instagram,
  onPress: async () => {
    return
  },
}
