import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { theme } from 'theme'
import { Spacer } from 'ui/theme'

import { CategoryBlock } from './CategoryBlock'

export default {
  title: 'features/home/CategoryBlock',
  component: CategoryBlock,
} as ComponentMeta<typeof CategoryBlock>

export const CategoryBlockWithoutImage: ComponentStory<typeof CategoryBlock> = () => (
  <Container>
    <CategoryBlock
      title={'Le plein de cinéma'}
      homeEntryId="6DCThxvbPFKAo04SVRZtwY"
      filter={{ color: theme.uniqueColors.brand, opacity: 0.7 }}
    />
    <Spacer.Column numberOfSpaces={10} />
    <CategoryBlock
      title={'Le plein de cinéma'}
      homeEntryId="6DCThxvbPFKAo04SVRZtwY"
      filter={{ color: theme.colors.secondary, opacity: 0.64 }}
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
      imageUrl="https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg"
    />
    <Spacer.Column numberOfSpaces={10} />

    <CategoryBlock
      title={'Le plein de cinéma'}
      homeEntryId="6DCThxvbPFKAo04SVRZtwY"
      filter={{ color: theme.colors.secondary, opacity: 0.64 }}
      imageUrl="https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg"
    />
  </Container>
)
CategoryBlockWithImage.storyName = 'CategoryBlocWithImage'

const Container = styled.View({
  height: 100,
  flexDirection: 'row',
})
