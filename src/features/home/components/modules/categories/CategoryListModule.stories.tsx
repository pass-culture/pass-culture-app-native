import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { categoryBlockList } from 'features/home/fixtures/categoryBlockList.fixture'

import { CategoryListModule } from './CategoryListModule'

export default {
  title: 'features/home/CategoryListModule',
  component: CategoryListModule,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
} as ComponentMeta<typeof CategoryListModule>

export const CategoryListWithThreeBlocks: ComponentStory<typeof CategoryListModule> = () => (
  <CategoryListModule
    id="123"
    title={'En ce moment sur le pass'}
    categoryBlockList={categoryBlockList.slice(1)}
  />
)
CategoryListWithThreeBlocks.storyName = 'CategoryListWithThreeBlocks'

export const CategoryListWithFourBlocks: ComponentStory<typeof CategoryListModule> = () => (
  <CategoryListModule
    id="123"
    title={'En ce moment sur le pass'}
    categoryBlockList={categoryBlockList}
  />
)
CategoryListWithFourBlocks.storyName = 'CategoryListWithFourBlocks'
