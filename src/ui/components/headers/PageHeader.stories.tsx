import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { PageHeader } from './PageHeader'

const meta: ComponentMeta<typeof PageHeader> = {
  title: 'ui/PageHeader',
  component: PageHeader,
}
export default meta

const Template: ComponentStory<typeof PageHeader> = (props) => <PageHeader {...props} />

export const Default = Template.bind({})
Default.args = {
  title: 'Page header',
}
