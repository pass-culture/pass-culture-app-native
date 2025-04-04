import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react'
import React from 'react'

import { categoryBlockList } from 'features/home/fixtures/categoryBlockList.fixture'
import { Variants, VariantsStory, VariantsTemplate } from 'ui/storybook/VariantsTemplate'

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

const variantConfig: Variants<typeof CategoryListModule> = [
  {
    label: 'CategoryListModule CategoryListWithThreeBlocks',
    props: {
      id: '123',
      title: 'En ce moment sur le pass',
      categoryBlockList: categoryBlockList.slice(1),
      homeEntryId: 'homeEntryId',
      index: 1,
    },
  },
  {
    label: 'CategoryListModule CategoryListWithFourBlocks',
    props: {
      id: '123',
      title: 'En ce moment sur le pass',
      categoryBlockList,
      homeEntryId: 'homeEntryId',
      index: 1,
    },
  },
]

export const Template: VariantsStory<typeof CategoryListModule> = {
  name: 'CategoryListModule',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={CategoryListModule}
      defaultProps={props}
    />
  ),
}
