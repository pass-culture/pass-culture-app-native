import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { ShareMessagingAppOther } from 'ui/components/ShareMessagingAppOther'

export default {
  title: 'ui/ShareMessagingAppOther',
  component: ShareMessagingAppOther,
} as ComponentMeta<typeof ShareMessagingAppOther>

const Template: ComponentStory<typeof ShareMessagingAppOther> = () => <ShareMessagingAppOther />

export const Default = Template.bind({})
