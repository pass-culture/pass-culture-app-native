import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { SpellingHelp } from './SpellingHelp'

export default {
  title: 'ui/inputs/EmailInputWithSpellingHelp/SpellingHelp',
  component: SpellingHelp,
} as ComponentMeta<typeof SpellingHelp>

const Template: ComponentStory<typeof SpellingHelp> = (props) => <SpellingHelp {...props} />

export const Default = Template.bind({})
Default.args = {
  suggestedEmail: {
    address: 'firstname.lastname',
    domain: 'gmail.com',
    full: 'firstname.lastname@gmail.com',
  },
}
