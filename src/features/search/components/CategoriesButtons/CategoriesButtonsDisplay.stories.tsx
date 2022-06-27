import { action } from '@storybook/addon-actions'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { categoriesIcons } from 'ui/svg/icons/bicolor/exports/categoriesIcons'
import { getSpacing } from 'ui/theme'

import { CategoriesButtonsDisplay } from './CategoriesButtonsDisplay'

export default {
  title: 'ui/CategoriesButtons',
  component: CategoriesButtonsDisplay,
} as ComponentMeta<typeof CategoriesButtonsDisplay>

const sortedCategories = [
  {
    label: 'Bibliothèque, médiathèque',
    Icon: categoriesIcons.VideoGame,
    onPress: action('Jeux'),
  },
  {
    label: 'CD, vinyles, musique en ligne',
    Icon: categoriesIcons.Music,
    onPress: action('Musique'),
  },
  {
    label: 'Cinéma',
    Icon: categoriesIcons.Cinema,
    onPress: action('Cinéma'),
  },
  {
    label: 'Conférences, rencontres',
    Icon: categoriesIcons.Book,
    onPress: action('Livre'),
  },
  {
    label: 'Théâtre',
    Icon: categoriesIcons.Workshop,
    onPress: action('Théâtre'),
  },
]

const Template: ComponentStory<typeof CategoriesButtonsDisplay> = (props) => (
  <Wrapper>
    <CategoriesButtonsDisplay {...props} />
  </Wrapper>
)

export const Default = Template.bind({})
Default.args = {
  sortedCategories,
}

const Wrapper = styled.View({
  marginHorizontal: getSpacing(1),
})
