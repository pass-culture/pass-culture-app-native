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
      baseColor: theme.colors.coral,
      gradients: [
        { color: theme.colors.coralLight, position: { x: 0, y: 0 } },
        { color: theme.colors.coral, position: { x: 0, y: 0.5 } },
      ],
    },
    {
      label: 'CD, vinyles, musique en ligne',
      Illustration: SearchCategoriesIllustrations.CDVinylsOnlineMusic,
      onPress: action('Musique'),
      baseColor: theme.colors.skyBlue,
      gradients: [
        { color: theme.colors.skyBlueLight, position: { x: 0, y: 0 } },
        { color: theme.colors.skyBlue, position: { x: 0, y: 0.5 } },
      ],
    },
    {
      label: 'Cinéma',
      Illustration: SearchCategoriesIllustrations.FilmsSeriesCinema,
      onPress: action('Cinéma'),
      baseColor: theme.colors.aquamarine,
      gradients: [
        { color: theme.colors.aquamarineLight, position: { x: 0, y: 0 } },
        { color: theme.colors.aquamarine, position: { x: 0, y: 0.5 } },
      ],
    },
    {
      label: 'Conférences, rencontres',
      Illustration: SearchCategoriesIllustrations.ConferencesMeetings,
      onPress: action('Livre'),
      baseColor: theme.colors.gold,
      gradients: [
        { color: theme.colors.goldLight, position: { x: 0, y: 0 } },
        { color: theme.colors.gold, position: { x: 0, y: 0.5 } },
      ],
    },
    {
      label: 'Théâtre',
      Illustration: SearchCategoriesIllustrations.Shows,
      onPress: action('Théâtre'),
      baseColor: theme.colors.coral,
      gradients: [
        { color: theme.colors.coralLight, position: { x: 0, y: 0 } },
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
