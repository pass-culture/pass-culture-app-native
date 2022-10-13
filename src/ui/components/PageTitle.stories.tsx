import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { PageTitle } from './PageTitle'

export default {
  title: 'ui/PageTitle',
  component: PageTitle,
} as ComponentMeta<typeof PageTitle>

const Template: ComponentStory<typeof PageTitle> = (props) => <PageTitle {...props} />

export const Default = Template.bind({})
Default.args = {
  title: 'Mon profil',
}
