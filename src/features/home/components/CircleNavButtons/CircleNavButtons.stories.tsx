import { ComponentMeta, StoryObj } from '@storybook/react'

import { CircleNavButtons } from './CircleNavButtons'

const meta: ComponentMeta<typeof CircleNavButtons> = {
  title: 'features/home/CircleNavButtons',
  component: CircleNavButtons,
}

export default meta

type Story = StoryObj<typeof CircleNavButtons>

export const Default: Story = {}
