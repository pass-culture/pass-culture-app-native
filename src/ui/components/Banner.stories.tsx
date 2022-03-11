import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { Banner } from './Banner'

export default {
  title: 'ui/Banner',
  component: Banner,
} as ComponentMeta<typeof Banner>

const Template: ComponentStory<typeof Banner> = (props) => <Banner {...props} />

export const Default = Template.bind({})
Default.args = {
  title: 'Je suis une bannière',
}
