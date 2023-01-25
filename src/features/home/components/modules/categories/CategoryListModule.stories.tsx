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

const Template: ComponentStory<typeof CategoryListModule> = (props) => (
  <CategoryListModule {...props} />
)

// TODO(PC-20094): Fix this story
const CategoryListWithThreeBlocks = Template.bind({})
CategoryListWithThreeBlocks.args = {
  id: '123',
  title: 'En ce moment sur le pass',
  categoryBlockList: categoryBlockList.slice(1),
  homeEntryId: 'homeEntryId',
  index: 1,
}

// TODO(PC-20094): Fix this story
const CategoryListWithFourBlocks = Template.bind({})
CategoryListWithFourBlocks.args = {
  id: '123',
  title: 'En ce moment sur le pass',
  categoryBlockList: categoryBlockList,
  homeEntryId: 'homeEntryId',
  index: 1,
}
