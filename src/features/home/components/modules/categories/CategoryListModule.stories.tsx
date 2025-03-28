import { NavigationContainer } from '@react-navigation/native'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { categoryBlockList } from 'features/home/fixtures/categoryBlockList.fixture'

import { CategoryListModule } from './CategoryListModule'

const meta: Meta<typeof CategoryListModule> = {
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
export default meta

type Story = StoryObj<typeof CategoryListModule>

export const CategoryListWithThreeBlocks: Story = {
  render: (props) => <CategoryListModule {...props} />,
  args: {
    id: '123',
    title: 'En ce moment sur le pass',
    categoryBlockList: categoryBlockList.slice(1),
    homeEntryId: 'homeEntryId',
    index: 1,
  },
}

export const CategoryListWithFourBlocks: Story = {
  render: (props) => <CategoryListModule {...props} />,
  args: {
    id: '123',
    title: 'En ce moment sur le pass',
    categoryBlockList,
    homeEntryId: 'homeEntryId',
    index: 1,
  },
}
