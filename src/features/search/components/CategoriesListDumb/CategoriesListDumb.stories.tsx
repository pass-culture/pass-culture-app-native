import { NavigationContainer } from '@react-navigation/native'
import { action } from '@storybook/addon-actions'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { SearchCategoriesIllustrations } from 'features/search/enums'
import { theme } from 'theme'
import { getSpacing } from 'ui/theme'

import { CategoriesListDumb } from './CategoriesListDumb'

const meta: ComponentMeta<typeof CategoriesListDumb> = {
  title: 'Features/search/CategoriesButtons',
  component: CategoriesListDumb,
}
export default meta

const BodyWrapper = styled.View({
  marginHorizontal: -getSpacing(4),
})

export const Default: ComponentStory<typeof CategoriesListDumb> = (props) => (
  <BodyWrapper>
    <NavigationContainer>
      <Container>
        <CategoriesListDumb {...props} />
      </Container>
    </NavigationContainer>
  </BodyWrapper>
)
Default.args = {
  sortedCategories: [
    {
      label: 'CD, vinyles, musique en ligne',
      Illustration: SearchCategoriesIllustrations.CDVinylsOnlineMusic,
      onPress: action('Musique'),
      baseColor: theme.colors.skyBlueDark,
      gradients: [theme.colors.skyBlue, theme.colors.skyBlueDark],
      textColor: theme.colors.coralDark,
      borderColor: theme.colors.skyBlue,
      fillColor: theme.colors.skyBlueLight,
    },
    {
      label: 'Cinéma',
      Illustration: SearchCategoriesIllustrations.FilmsSeriesCinema,
      onPress: action('Cinéma'),
      baseColor: theme.colors.aquamarineDark,
      gradients: [theme.colors.aquamarine, theme.colors.aquamarineDark],
      textColor: theme.colors.skyBlueDark,
      borderColor: theme.colors.coral,
      fillColor: theme.colors.coralLight,
    },
    {
      label: 'Conférences, rencontres',
      Illustration: SearchCategoriesIllustrations.ConferencesMeetings,
      onPress: action('Livre'),
      baseColor: theme.colors.goldDark,
      gradients: [theme.colors.gold, theme.colors.goldDark],
      textColor: theme.colors.aquamarineDark,
      borderColor: theme.colors.deepPink,
      fillColor: theme.colors.deepPinkLight,
    },
    {
      label: 'Théâtre',
      Illustration: SearchCategoriesIllustrations.Shows,
      onPress: action('Théâtre'),
      baseColor: theme.colors.coralDark,
      gradients: [theme.colors.coral, theme.colors.coralDark],
      textColor: theme.colors.skyBlueDark,
      borderColor: theme.colors.coral,
      fillColor: theme.colors.coralLight,
    },
    {
      label: 'Concerts & festivals',
      Illustration: SearchCategoriesIllustrations.ConcertsFestivals,
      textColor: theme.colors.lilacDark,
      gradients: [theme.colors.gold, theme.colors.goldDark],
      onPress: action('Concerts & festivals'),
      fillColor: theme.colors.goldLight100,
      borderColor: theme.colors.goldLight200,
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

const Container = styled(View)({
  maxWidth: 1024,
})
