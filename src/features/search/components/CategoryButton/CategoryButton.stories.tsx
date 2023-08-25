import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { SearchCategoriesIllustrations } from 'features/internal/cheatcodes/pages/AppComponents/illustrationsExports'
import { theme } from 'theme'

import { CategoryButton } from './CategoryButton'

const meta: ComponentMeta<typeof CategoryButton> = {
  title: 'Features/search/CategoryButton',
  component: CategoryButton,
}
export default meta

const Template: ComponentStory<typeof CategoryButton> = (props) => <CategoryButton {...props} />

export const Default = Template.bind({})
Default.args = {
  label: 'Bibliothèques & Médiathèques',
  Illustration: SearchCategoriesIllustrations.Books,
  baseColor: theme.colors.coral,
  gradients: [theme.colors.coralLight, theme.colors.coral],
}
