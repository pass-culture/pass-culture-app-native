import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { PageHeader } from './PageHeader'

export default {
  title: 'ui/PageTitle',
  component: PageHeader,
} as ComponentMeta<typeof PageHeader>

const Template: ComponentStory<typeof PageHeader> = (props) => <PageHeader {...props} />

export const Default = Template.bind({})
Default.args = {
  title: 'Page header',
}
