import { StoryObj, Meta } from '@storybook/react'
import React from 'react'

import { Network } from 'libs/share/types'
import { ShareMessagingApp } from 'ui/components/ShareMessagingApp'

const meta: Meta<typeof ShareMessagingApp> = {
  title: 'ui/share/ShareMessagingApp',
  component: ShareMessagingApp,
}
export default meta

const Template: StoryObj<typeof ShareMessagingApp> = (args) => <ShareMessagingApp {...args} />

export const Default = Template.bind({})
Default.storyName = 'ShareMessagingApp'
Default.args = {
  network: Network.instagram,
  onPress: async () => {
    return
  },
}
