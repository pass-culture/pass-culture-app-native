import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
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
      label: 'Concerts & Festivals',
      navigateTo: {
        screen: 'TabNavigator',
        params: {
          screen: 'ThematicSearch',
          params: { offerCategories: SearchGroupNameEnumv2.CONCERTS_FESTIVALS },
          isFullyDigitalOffersCategory: false,
          withPush: true,
        },
      },
      fillColor: theme.colors.goldLight100,
      borderColor: theme.colors.goldLight200,
    },
    {
      label: 'Cinéma',
      navigateTo: {
        screen: 'TabNavigator',
        params: {
          screen: 'ThematicSearch',
          params: { offerCategories: SearchGroupNameEnumv2.CINEMA },
          isFullyDigitalOffersCategory: false,
          withPush: true,
        },
      },
      borderColor: theme.colors.skyBlue,
      fillColor: theme.colors.skyBlueLight,
    },
    {
      label: 'Films, séries et documentaires',
      navigateTo: {
        screen: 'TabNavigator',
        params: {
          screen: 'ThematicSearch',
          params: { offerCategories: SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES },
          isFullyDigitalOffersCategory: false,
          withPush: true,
        },
      },
      borderColor: theme.colors.lilac,
      fillColor: theme.colors.lilacLight,
    },
    {
      label: 'Livres',
      navigateTo: {
        screen: 'TabNavigator',
        params: {
          screen: 'ThematicSearch',
          params: { offerCategories: SearchGroupNameEnumv2.LIVRES },
          isFullyDigitalOffersCategory: false,
          withPush: true,
        },
      },
      borderColor: theme.colors.coral,
      fillColor: theme.colors.coralLight,
    },
    {
      label: 'Musique',
      navigateTo: {
        screen: 'TabNavigator',
        params: {
          screen: 'ThematicSearch',
          params: { offerCategories: SearchGroupNameEnumv2.MUSIQUE },
          isFullyDigitalOffersCategory: false,
          withPush: true,
        },
      },
      borderColor: theme.colors.aquamarineDark,
      fillColor: theme.colors.aquamarineLight,
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
