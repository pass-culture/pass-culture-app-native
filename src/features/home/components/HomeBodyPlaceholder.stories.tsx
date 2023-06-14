import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { HomeBodyPlaceholder } from './HomeBodyPlaceholder'

export default {
  title: 'ui/placeholders',
  component: HomeBodyPlaceholder,
} as ComponentMeta<typeof HomeBodyPlaceholder>

export const HomeBody: ComponentStory<typeof HomeBodyPlaceholder> = () => <HomeBodyPlaceholder />
HomeBody.storyName = 'HomeBodyPlaceholder'
HomeBody.parameters = {
  // Notifies Chromatic to pause the animations when they finish for the specific story.
  chromatic: { pauseAnimationAtEnd: true },
}
