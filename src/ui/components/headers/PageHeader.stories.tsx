import { StoryObj, Meta } from '@storybook/react'
import React from 'react'

import { PageHeader } from './PageHeader'

const meta: Meta<typeof PageHeader> = {
  title: 'ui/PageHeader',
  component: PageHeader,
}
export default meta

const Template: StoryObj<typeof PageHeader> = (props) => <PageHeader {...props} />

export const Default = Template.bind({})
Default.storyName = 'PageHeader'
Default.args = { title: 'Page header' }
