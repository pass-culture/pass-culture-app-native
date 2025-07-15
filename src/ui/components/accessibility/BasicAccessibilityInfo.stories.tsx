import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { BasicAccessibilityInfo } from './BasicAccessibilityInfo'

const meta: Meta<typeof BasicAccessibilityInfo> = {
  title: 'ui/accessibility/BasicAccessibilityInfo',
  component: BasicAccessibilityInfo,
}
export default meta

type Story = StoryObj<typeof BasicAccessibilityInfo>

export const Default: Story = {
  render: (props) => <BasicAccessibilityInfo {...props} />,
  name: 'BasicAccessibilityInfo',
  args: {
    accessibility: {
      audioDisability: false,
      mentalDisability: false,
      motorDisability: true,
      visualDisability: true,
    },
  },
}
