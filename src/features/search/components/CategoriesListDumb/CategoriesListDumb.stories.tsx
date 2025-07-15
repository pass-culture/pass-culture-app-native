import { NavigationContainer } from '@react-navigation/native'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { theme } from 'theme'
import { getSpacing } from 'ui/theme'

import { CategoriesListDumb } from './CategoriesListDumb'

const meta: Meta<typeof CategoriesListDumb> = {
  title: 'Features/search/CategoriesButtons',
  component: CategoriesListDumb,
}
export default meta

const BodyWrapper = styled.View({
  marginHorizontal: -getSpacing(4),
})

type Story = StoryObj<typeof CategoriesListDumb>

export const Default: Story = {
  name: 'CategoriesButtons',
  render: (props) => (
    <BodyWrapper>
      <NavigationContainer>
        <Container>
          <CategoriesListDumb {...props} />
        </Container>
      </NavigationContainer>
    </BodyWrapper>
  ),
  args: {
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
        position: undefined,
        fillColor: 'decorative01',
        borderColor: 'decorative01',
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
        position: undefined,
        borderColor: 'decorative02',
        fillColor: 'decorative02',
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
        position: undefined,
        borderColor: 'decorative04',
        fillColor: 'decorative04',
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
        position: undefined,
        borderColor: 'decorative05',
        fillColor: 'decorative05',
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
        position: undefined,
        borderColor: 'decorative03',
        fillColor: 'decorative03',
      },
    ],
  },
  parameters: {
    chromatic: {
      viewports: [
        theme.breakpoints.xxs,
        theme.breakpoints.sm,
        theme.breakpoints.md,
        theme.breakpoints.lg,
        theme.breakpoints.xl,
      ],
    },
  },
}

const Container = styled(View)({
  maxWidth: 1024,
})
