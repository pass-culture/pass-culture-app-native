import { StoryObj, Meta } from '@storybook/react'
import React from 'react'

import { ShareMessagingAppOther } from 'ui/components/ShareMessagingAppOther'

const meta: Meta<typeof ShareMessagingAppOther> = {
  title: 'ui/share/ShareMessagingAppOther',
  component: ShareMessagingAppOther,
}
export default meta

const Template: StoryObj<typeof ShareMessagingAppOther> = (args) => (
  <ShareMessagingAppOther {...args} />
)

export const Default = Template.bind({})
Default.storyName = 'ShareMessagingAppOther'
Default.args = {
  onPress: async () => {
    return
  },
}
