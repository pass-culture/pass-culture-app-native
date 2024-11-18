import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

import { EmailAttemptsLeft } from './EmailAttemptsLeft'

const meta: ComponentMeta<typeof EmailAttemptsLeft> = {
  title: 'features/auth/EmailAttemptsLeft',
  component: EmailAttemptsLeft,
}
export default meta

const variantConfig = [
  {
    label: 'EmailAttemptsLeft multiple attempt',
    props: { attemptsLeft: 2 },
  },
  {
    label: 'EmailAttemptsLeft last attempt',
    props: { attemptsLeft: 1 },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={EmailAttemptsLeft} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'EmailAttemptsLeft'
