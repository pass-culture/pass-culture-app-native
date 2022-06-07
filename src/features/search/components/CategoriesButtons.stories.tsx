import { action } from '@storybook/addon-actions'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { categoriesIcons } from 'ui/svg/icons/bicolor/exports/categoriesIcons'

import { CategoriesButtons } from './CategoriesButtons'

export default {
  title: 'ui/CategoriesButtons',
  component: CategoriesButtons,
} as ComponentMeta<typeof CategoriesButtons>

const Template: ComponentStory<typeof CategoriesButtons> = (props) => (
  <CategoriesButtons {...props} />
)

export const Default = Template.bind({})
Default.args = {
  categories: [
    {
      label: 'Musique',
      color: 'blue',
      Icon: categoriesIcons.Music,
      onPress: action('Musique'),
    },
    {
      label: 'Cinéma',
      color: 'royalblue',
      Icon: categoriesIcons.Cinema,
      onPress: action('Cinéma'),
    },
    {
      label: 'Livre',
      color: 'purple',
      Icon: categoriesIcons.Book,
      onPress: action('Livre'),
    },
    {
      label: 'Théâtre',
      color: 'green',
      Icon: categoriesIcons.Workshop,
      onPress: action('Théâtre'),
    },
  ],
}
