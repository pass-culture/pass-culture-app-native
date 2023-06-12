import { action } from '@storybook/addon-actions'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { SearchCategoriesIllustrations } from 'features/internal/cheatcodes/pages/AppComponents/illustrationsExports'
import { theme } from 'theme'
import { getSpacing } from 'ui/theme'

import { CategoriesButtonsDisplay } from './CategoriesButtonsDisplay'

export default {
  title: 'Features/search/CategoriesButtons',
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
      Illustration: SearchCategoriesIllustrations.LibrariesMediaLibraries,
      onPress: action('Jeux'),
      gradients: [
        { color: '#F8733D', position: { x: 0, y: 0 } },
        { color: theme.colors.coral, position: { x: 0, y: 0.5 } },
      ],
    },
    {
      label: 'CD, vinyles, musique en ligne',
      Illustration: SearchCategoriesIllustrations.CDVinylsOnlineMusic,
      onPress: action('Musique'),
      gradients: [
        { color: '#20C5E9', position: { x: 0, y: 0 } },
        { color: theme.colors.skyBlue, position: { x: 0, y: 0.5 } },
      ],
    },
    {
      label: 'Cinéma',
      Illustration: SearchCategoriesIllustrations.FilmsSeriesCinema,
      onPress: action('Cinéma'),
      gradients: [
        { color: '#27DCA8', position: { x: 0, y: 0 } },
        { color: theme.colors.aquamarine, position: { x: 0, y: 0.5 } },
      ],
    },
    {
      label: 'Conférences, rencontres',
      Illustration: SearchCategoriesIllustrations.ConferencesMeetings,
      onPress: action('Livre'),
      gradients: [
        { color: '#F99E15', position: { x: 0, y: 0 } },
        { color: theme.colors.gold, position: { x: 0, y: 0.5 } },
      ],
    },
    {
      label: 'Théâtre',
      Illustration: SearchCategoriesIllustrations.Shows,
      onPress: action('Théâtre'),
      gradients: [
        { color: '#F8733D', position: { x: 0, y: 0 } },
        { color: theme.colors.coral, position: { x: 0, y: 0.5 } },
      ],
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
