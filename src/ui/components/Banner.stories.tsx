import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { selectArgTypeFromObject } from 'libs/storybook/selectArgTypeFromObject'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { Error } from 'ui/svg/icons/Error'
import { Warning } from 'ui/svg/icons/Warning'

import { Banner } from './Banner'

export default {
  title: 'ui/Banner',
  component: Banner,
  argTypes: {
    icon: selectArgTypeFromObject({
      Error,
      Warning,
      BicolorIdCard,
    }),
  },
} as ComponentMeta<typeof Banner>

const Template: ComponentStory<typeof Banner> = (props) => <Banner {...props} />

export const Default = Template.bind({})
Default.args = {
  title: 'Je suis une bannière',
}
