import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { ShareMessagingAppOther } from 'ui/components/ShareMessagingAppOther'

export default {
  title: 'ui/share/ShareMessagingAppOther',
  component: ShareMessagingAppOther,
} as ComponentMeta<typeof ShareMessagingAppOther>

const Template: ComponentStory<typeof ShareMessagingAppOther> = (args) => (
  <ShareMessagingAppOther {...args} />
)

export const Default = Template.bind({})
Default.args = {
  onPress: async () => {
    return
  },
}
