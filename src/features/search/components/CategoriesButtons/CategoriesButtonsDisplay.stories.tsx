import { action } from '@storybook/addon-actions'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { StoryViewport } from 'ui/storybook/StoryViewport'
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

const BodyWrapper = styled.View({
  marginHorizontal: -getSpacing(4),
})

const Wrapper = styled.View({
  marginHorizontal: getSpacing(5),
})

const Template = (Component: FunctionComponent) => {
  const WrappedComponent: ComponentStory<typeof CategoriesButtonsDisplay> = (props) => (
    <Component>
      <Wrapper>
        <CategoriesButtonsDisplay {...props} />
      </Wrapper>
    </Component>
  )
  return WrappedComponent
}

export const Default = Template(BodyWrapper)
Default.args = {
  sortedCategories,
}

export const OnSmallPhone = Template(StoryViewport.SmallPhone)
OnSmallPhone.args = {
  sortedCategories,
}

export const OnPhone = Template(StoryViewport.Phone)
OnPhone.args = {
  sortedCategories,
}

export const OnTablet = Template(StoryViewport.Tablet)
OnTablet.args = {
  sortedCategories,
}

export const OnDesktop = Template(StoryViewport.Desktop)
OnDesktop.args = {
  sortedCategories,
}
