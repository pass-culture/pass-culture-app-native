import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { ShareMessagingAppOther } from 'ui/components/ShareMessagingAppOther'

const meta: ComponentMeta<typeof ShareMessagingAppOther> = {
  title: 'ui/share/ShareMessagingAppOther',
  component: ShareMessagingAppOther,
}
export default meta

const Template: ComponentStory<typeof ShareMessagingAppOther> = (args) => (
  <ShareMessagingAppOther {...args} />
)

export const Default = Template.bind({})
Default.args = {
  onPress: async () => {
    return
  },
}
