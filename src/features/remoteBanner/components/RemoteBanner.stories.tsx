import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { RemoteBanner } from 'features/remoteBanner/components/RemoteBanner'

const meta: ComponentMeta<typeof RemoteBanner> = {
  title: 'ui/banners/RemoteBanner',
  component: RemoteBanner,
}
export default meta

const Template: ComponentStory<typeof RemoteBanner> = () => <RemoteBanner from="Profile" />

export const RemoteBannerStory = Template.bind({})
RemoteBannerStory.storyName = 'RemoteBanner'
