import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { CategoryBlock } from 'features/home/types'

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

const categoryBlockList: CategoryBlock[] = [
  {
    id: '1',
    title: 'Le plein de cinéma, Le plein de cinéma, Le plein de cinéma, Le plein de cinéma',
    image: 'https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg',
    homeEntryId: '6DCThxvbPFKAo04SVRZtwY',
  },
  {
    id: '2',
    title: 'Toto au cinéma',
    image: 'https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg',
    homeEntryId: '6DCThxvbPFKAo04SVRZtwY',
  },
  {
    id: '3',
    title: 'Martine au cinéma',
    image: 'https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg',
    homeEntryId: '6DCThxvbPFKAo04SVRZtwY',
  },
  {
    id: '4',
    title: 'Babar au cinéma',
    image: 'https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg',
    homeEntryId: '6DCThxvbPFKAo04SVRZtwY',
  },
]
