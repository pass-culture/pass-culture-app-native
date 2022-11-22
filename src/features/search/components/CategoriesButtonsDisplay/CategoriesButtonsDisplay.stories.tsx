import { action } from '@storybook/addon-actions'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { theme } from 'theme'
import { categoriesIcons } from 'ui/svg/icons/bicolor/exports/categoriesIcons'
import { getSpacing } from 'ui/theme'

import { CategoriesButtonsDisplay } from './CategoriesButtonsDisplay'

export default {
  title: 'Features/Search/CategoriesButtons',
  component: CategoriesButtonsDisplay,
} as ComponentMeta<typeof CategoriesButtonsDisplay>

const BodyWrapper = styled.View({
  marginHorizontal: -getSpacing(4),
})

export const Default: ComponentStory<typeof CategoriesButtonsDisplay> = (props) => (
  <BodyWrapper>
    <CategoriesButtonsDisplay {...props} />
  </BodyWrapper>
)
Default.args = {
  sortedCategories: [
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
  ],
}
Default.parameters = {
  chromatic: {
    viewports: [
      theme.breakpoints.xxs,
      theme.breakpoints.sm,
      theme.breakpoints.md,
      theme.breakpoints.lg,
      theme.breakpoints.xl,
    ],
  },
}
