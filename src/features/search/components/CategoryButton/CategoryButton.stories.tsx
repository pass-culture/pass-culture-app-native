import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { SearchCategoriesIllustrations } from 'features/internal/cheatcodes/pages/AppComponents/illustrationsExports'
import { theme } from 'theme'

import { CategoryButton } from './CategoryButton'

export default {
  title: 'Features/search/CategoryButton',
  component: CategoryButton,
} as ComponentMeta<typeof CategoryButton>

const Template: ComponentStory<typeof CategoryButton> = (props) => <CategoryButton {...props} />

export const Default = Template.bind({})
Default.args = {
  label: 'Bibliothèques & Médiathèques',
  Illustration: SearchCategoriesIllustrations.Books,
  baseColor: theme.colors.coral,
  gradients: [theme.colors.coralLight, theme.colors.coral],
}
