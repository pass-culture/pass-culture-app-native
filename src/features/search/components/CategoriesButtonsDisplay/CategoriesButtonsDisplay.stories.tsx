import { action } from '@storybook/addon-actions'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { SearchCategoriesIllustrations } from 'features/search/enums'
import { theme } from 'theme'
import { getSpacing } from 'ui/theme'

import { CategoriesButtonsDisplay } from './CategoriesButtonsDisplay'

const meta: ComponentMeta<typeof CategoriesButtonsDisplay> = {
  title: 'Features/search/CategoriesButtons',
  component: CategoriesButtonsDisplay,
}
export default meta

const BodyWrapper = styled.View({
  marginHorizontal: -getSpacing(4),
})

// TODO(PC-20094): Fix this story
const Default: ComponentStory<typeof CategoriesButtonsDisplay> = (props) => (
  <BodyWrapper>
    <CategoriesButtonsDisplay {...props} />
  </BodyWrapper>
)
Default.args = {
  sortedCategories: [
    {
      label: 'CD, vinyles, musique en ligne',
      Illustration: SearchCategoriesIllustrations.CDVinylsOnlineMusic,
      onPress: action('Musique'),
      baseColor: theme.colors.skyBlue,
      gradients: [theme.colors.skyBlueLight, theme.colors.skyBlue],
    },
    {
      label: 'Cinéma',
      Illustration: SearchCategoriesIllustrations.FilmsSeriesCinema,
      onPress: action('Cinéma'),
      baseColor: theme.colors.aquamarine,
      gradients: [theme.colors.aquamarineLight, theme.colors.aquamarine],
    },
    {
      label: 'Conférences, rencontres',
      Illustration: SearchCategoriesIllustrations.ConferencesMeetings,
      onPress: action('Livre'),
      baseColor: theme.colors.gold,
      gradients: [theme.colors.goldLight, theme.colors.gold],
    },
    {
      label: 'Théâtre',
      Illustration: SearchCategoriesIllustrations.Shows,
      onPress: action('Théâtre'),
      baseColor: theme.colors.coral,
      gradients: [theme.colors.coralLight, theme.colors.coral],
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
