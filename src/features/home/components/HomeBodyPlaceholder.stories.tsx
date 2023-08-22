import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { HomeBodyPlaceholder } from './HomeBodyPlaceholder'

const meta: ComponentMeta<typeof HomeBodyPlaceholder> = {
  title: 'ui/placeholders',
  component: HomeBodyPlaceholder,
}
export default meta

export const HomeBody: ComponentStory<typeof HomeBodyPlaceholder> = () => <HomeBodyPlaceholder />
HomeBody.storyName = 'HomeBodyPlaceholder'
