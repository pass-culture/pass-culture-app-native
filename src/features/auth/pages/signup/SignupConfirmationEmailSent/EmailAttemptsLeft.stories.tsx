import { Meta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

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

const Template: VariantsStory<typeof EmailAttemptsLeft> = (args) => (
  <VariantsTemplate
    variants={variantConfig}
    Component={EmailAttemptsLeft}
    defaultProps={{ ...args }}
  />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'EmailAttemptsLeft'
