import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { getSpacing } from 'ui/theme'

import { Tooltip } from './Tooltip'

const TOOLTIP_WIDTH = getSpacing(58)

const meta: Meta<typeof Tooltip> = {
  title: 'ui/Tooltip',
  component: Tooltip,
}
export default meta

type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  name: 'Tooltip',
  render: (props) => <Tooltip {...props} />,
  args: {
    label: 'Configure ta position et découvre les offres dans la zone géographique de ton choix.',
    isVisible: true,
    style: { width: TOOLTIP_WIDTH },
  },
}
