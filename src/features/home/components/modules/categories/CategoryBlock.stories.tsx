import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { theme } from 'theme'
import { Spacer } from 'ui/theme'

import { CategoryBlock } from './CategoryBlock'

export default {
  title: 'features/home/CategoryBlock',
  component: CategoryBlock,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
} as ComponentMeta<typeof CategoryBlock>

export const CategoryBlockWithoutImage: ComponentStory<typeof CategoryBlock> = () => (
  <Container>
    <CategoryBlock
      title={'Le plein de cinéma'}
      homeEntryId="6DCThxvbPFKAo04SVRZtwY"
      filter={{ color: theme.uniqueColors.brand, opacity: 0.7 }}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onBeforePress={() => {}}
    />
    <Spacer.Column numberOfSpaces={10} />
    <CategoryBlock
      title={'Le plein de cinéma'}
      homeEntryId="6DCThxvbPFKAo04SVRZtwY"
      filter={{ color: theme.colors.secondary, opacity: 0.64 }}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onBeforePress={() => {}}
    />
  </Container>
)
CategoryBlockWithoutImage.storyName = 'CategoryBlocWithoutImage'

export const CategoryBlockWithImage: ComponentStory<typeof CategoryBlock> = () => (
  <Container>
    <CategoryBlock
      title={'Le plein de cinéma'}
      homeEntryId="6DCThxvbPFKAo04SVRZtwY"
      filter={{ color: theme.uniqueColors.brand, opacity: 0.7 }}
      image="https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg"
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onBeforePress={() => {}}
    />
    <Spacer.Column numberOfSpaces={10} />

    <CategoryBlock
      title={'Le plein de cinéma'}
      homeEntryId="6DCThxvbPFKAo04SVRZtwY"
      filter={{ color: theme.colors.secondary, opacity: 0.64 }}
      image="https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg"
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onBeforePress={() => {}}
    />
  </Container>
)
CategoryBlockWithImage.storyName = 'CategoryBlocWithImage'

const Container = styled.View({
  height: 100,
  flexDirection: 'row',
})
