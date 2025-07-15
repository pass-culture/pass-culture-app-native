import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants } from 'ui/storybook/VariantsTemplate'

import { EmailAttemptsLeft } from './EmailAttemptsLeft'

const meta: Meta<typeof EmailAttemptsLeft> = {
  title: 'features/auth/EmailAttemptsLeft',
  component: EmailAttemptsLeft,
}
export default meta

const variantConfig: Variants<typeof EmailAttemptsLeft> = [
  {
    label: 'EmailAttemptsLeft multiple attempt',
    props: { attemptsLeft: 2 },
  },
  {
    label: 'EmailAttemptsLeft last attempt',
    props: { attemptsLeft: 1 },
  },
]

type Story = StoryObj<typeof EmailAttemptsLeft>

export const AllVariants: Story = {
  name: 'EmailAttemptsLeft',
  render: (args: React.ComponentProps<typeof EmailAttemptsLeft>) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={EmailAttemptsLeft}
      defaultProps={{ ...args }}
    />
  ),
}
