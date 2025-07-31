import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { PageHeader } from './PageHeader'

const meta: Meta<typeof PageHeader> = {
  title: 'ui/PageHeader',
  component: PageHeader,
}
export default meta

type Story = StoryObj<typeof PageHeader>

export const Default: Story = {
  render: (props) => <PageHeader {...props} />,
  args: { title: 'Page header' },
  name: 'PageHeader',
}
