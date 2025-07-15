import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { InformationStepContent } from './InformationStepContent'

const meta: Meta<typeof InformationStepContent> = {
  title: 'features/tutorial/InformationStepContent',
  component: InformationStepContent,
}
export default meta

type Story = StoryObj<typeof InformationStepContent>

export const Default: Story = {
  render: (props) => <InformationStepContent {...props} />,
  args: { title: 'La veille de tes 18 ans', subtitle: 'Ton crédit est remis à 0' },
  name: 'InformationStepContent',
}
