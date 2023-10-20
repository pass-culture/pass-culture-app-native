import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { Color } from 'features/home/types'
import { Spacer } from 'ui/theme'

import { CategoryBlock } from './CategoryBlock'

const componentMeta: ComponentMeta<typeof CategoryBlock> = {
  title: 'features/home/CategoryBlock',
  component: CategoryBlock,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default componentMeta

export const CategoryBlockWithoutImage: ComponentStory<typeof CategoryBlock> = () => (
  <Container>
    <CategoryBlock
      title="Le plein de cinéma"
      color={Color.Gold}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onBeforePress={() => {}}
      navigateTo={{ screen: 'ThematicHome' }}
    />
    <Spacer.Column numberOfSpaces={10} />
    <CategoryBlock
      title="Le plein de cinéma"
      color={Color.Aquamarine}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onBeforePress={() => {}}
      navigateTo={{ screen: 'ThematicHome' }}
    />
  </Container>
)
CategoryBlockWithoutImage.storyName = 'CategoryBlocWithoutImage'

const Container = styled.View({
  height: 100,
  flexDirection: 'row',
})
