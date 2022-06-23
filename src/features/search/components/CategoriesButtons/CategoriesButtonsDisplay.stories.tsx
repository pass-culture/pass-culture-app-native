import { action } from '@storybook/addon-actions'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { categoriesIcons } from 'ui/svg/icons/bicolor/exports/categoriesIcons'

import { CategoriesButtonsDisplay } from './CategoriesButtonsDisplay'

export default {
  title: 'ui/CategoriesButtons',
  component: CategoriesButtonsDisplay,
} as ComponentMeta<typeof CategoriesButtonsDisplay>

const Template: ComponentStory<typeof CategoriesButtonsDisplay> = (props) => (
  <CategoriesButtonsDisplay {...props} />
)

export const Default = Template.bind({})
Default.args = {
  sortedCategories: [
    {
      label: 'Cinéma',
      Icon: categoriesIcons.Cinema,
      onPress: action('Cinéma'),
    },
    {
      label: 'Livre',
      Icon: categoriesIcons.Book,
      onPress: action('Livre'),
    },
    {
      label: 'Musique',
      Icon: categoriesIcons.Music,
      onPress: action('Musique'),
    },
    {
      label: 'Théâtre',
      Icon: categoriesIcons.Workshop,
      onPress: action('Théâtre'),
    },
  ],
}

export const WithOddNumberOfCategories = Template.bind({})
WithOddNumberOfCategories.args = {
  sortedCategories: [
    {
      label: 'Cinéma',
      Icon: categoriesIcons.Cinema,
      onPress: action('Cinéma'),
    },
    {
      label: 'Jeux',
      Icon: categoriesIcons.VideoGame,
      onPress: action('Jeux'),
    },
    {
      label: 'Livre',
      Icon: categoriesIcons.Book,
      onPress: action('Livre'),
    },
    {
      label: 'Musique',
      Icon: categoriesIcons.Music,
      onPress: action('Musique'),
    },
    {
      label: 'Théâtre',
      Icon: categoriesIcons.Workshop,
      onPress: action('Théâtre'),
    },
  ],
}
