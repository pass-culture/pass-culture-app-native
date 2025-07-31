import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { theme } from 'theme'
import { Variants, VariantsStory, VariantsTemplate } from 'ui/storybook/VariantsTemplate'

import { SpellingHelp } from './SpellingHelp'

const meta: Meta<typeof SpellingHelp> = {
  title: 'ui/inputs/EmailInputWithSpellingHelp/SpellingHelp',
  component: SpellingHelp,
  parameters: {
    chromatic: { viewports: [theme.breakpoints.xxs, theme.breakpoints.md] },
  },
}
export default meta

const variantConfig: Variants<typeof SpellingHelp> = [
  {
    label: 'SpellingHelp Default',
    props: {
      suggestedEmail: {
        address: 'firstname.lastname',
        domain: 'gmail.com',
        full: 'firstname.lastname@gmail.com',
      },
    },
  },
  {
    label: 'SpellingHelp WithLargeSuggestedEmail',
    props: {
      suggestedEmail: {
        address: 'firstname.secondfirstname.lastname.secondlastname',
        domain: 'gmail.com',
        full: 'firstname.secondfirstname.lastname.secondlastname@gmail.com',
      },
    },
  },
]

export const Template: VariantsStory<typeof SpellingHelp> = {
  name: 'SpellingHelp',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={SpellingHelp} defaultProps={props} />
  ),
}
