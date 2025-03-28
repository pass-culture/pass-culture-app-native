import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { theme } from 'theme'

import { SpellingHelp } from './SpellingHelp'

const meta: Meta<typeof SpellingHelp> = {
  title: 'ui/inputs/EmailInputWithSpellingHelp/SpellingHelp',
  component: SpellingHelp,
  parameters: {
    chromatic: { viewports: [theme.breakpoints.xxs, theme.breakpoints.md] },
  },
}
export default meta

type Story = StoryObj<typeof SpellingHelp>

export const Default: Story = {
  render: (props) => <SpellingHelp {...props} />,
  args: {
    suggestedEmail: {
      address: 'firstname.lastname',
      domain: 'gmail.com',
      full: 'firstname.lastname@gmail.com',
    },
  },
}

export const WithLargeSuggestedEmail: Story = {
  render: (props) => <SpellingHelp {...props} />,
  args: {
    suggestedEmail: {
      address: 'firstname.secondfirstname.lastname.secondlastname',
      domain: 'gmail.com',
      full: 'firstname.secondfirstname.lastname.secondlastname@gmail.com',
    },
  },
}
