import { NavigationContainer } from '@react-navigation/native'
import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { categoryBlockList } from 'features/home/fixtures/categoryBlockList.fixture'

import { CategoryListModule } from './CategoryListModule'

const componentMeta: Meta<typeof CategoryListModule> = {
  title: 'features/home/CategoryListModule',
  component: CategoryListModule,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default componentMeta

const Template: StoryObj<typeof CategoryListModule> = (props) => (
  <CategoryListModule {...props} />
)
//TODO(PC-30279): Fix this stories
const CategoryListWithThreeBlocks = Template.bind({})
CategoryListWithThreeBlocks.args = {
  id: '123',
  title: 'En ce moment sur le pass',
  categoryBlockList: categoryBlockList.slice(1),
  homeEntryId: 'homeEntryId',
  index: 1,
}
//TODO(PC-30279): Fix this stories
const CategoryListWithFourBlocks = Template.bind({})
CategoryListWithFourBlocks.args = {
  id: '123',
  title: 'En ce moment sur le pass',
  categoryBlockList,
  homeEntryId: 'homeEntryId',
  index: 1,
}
