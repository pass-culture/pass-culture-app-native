import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { SearchCategoriesIllustrations } from 'features/internal/cheatcodes/pages/AppComponents/illustrationsExports'

import { CategoryButton } from './CategoryButton'

export default {
  title: 'Features/search/CategoryButton',
  component: CategoryButton,
} as ComponentMeta<typeof CategoryButton>

const Template: ComponentStory<typeof CategoryButton> = (props) => <CategoryButton {...props} />

export const WithColor = Template.bind({})
WithColor.args = {
  label: 'Bibliothèques & Médiathèques',
  Illustration: SearchCategoriesIllustrations.Books,
  baseColor: '#870087',
}

export const WithoutColor = Template.bind({})
WithoutColor.args = {
  label: 'Bibliothèques & Médiathèques',
  Illustration: SearchCategoriesIllustrations.Books,
}
