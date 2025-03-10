import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { TutorialTimelineSixteen } from './TutorialTimelineSixteen'

const meta: Meta<typeof TutorialTimelineSixteen> = {
  title: 'features/tutorial/TutorialTimelineSixteen',
  component: TutorialTimelineSixteen,
}
export default meta

type Story = StoryObj<typeof TutorialTimelineSixteen>

export const WithoutActivation: Story = {
  render: (props) => <TutorialTimelineSixteen {...props} />,
  args: {
    activatedAt: undefined,
  },
}

export const ActivatedAt15: Story = {
  render: (props) => <TutorialTimelineSixteen {...props} />,
  args: {
    activatedAt: 15,
  },
}
