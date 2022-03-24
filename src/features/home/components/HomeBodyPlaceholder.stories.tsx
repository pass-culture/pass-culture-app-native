import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { HomeBodyPlaceholder } from './HomeBodyPlaceholder'

export default {
  title: 'ui/placeholders',
  component: HomeBodyPlaceholder,
} as ComponentMeta<typeof HomeBodyPlaceholder>

export const HomeBody: ComponentStory<typeof HomeBodyPlaceholder> = () => <HomeBodyPlaceholder />
HomeBody.storyName = 'HomeBodyPlaceholder'
