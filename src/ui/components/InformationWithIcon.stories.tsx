import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { BicolorClock } from 'ui/svg/icons/BicolorClock'

import { InformationWithIcon } from './InformationWithIcon'

const meta: ComponentMeta<typeof InformationWithIcon> = {
  title: 'ui/InformationWithIcon',
  component: InformationWithIcon,
}
export default meta

const Template: ComponentStory<typeof InformationWithIcon> = (props) => (
  <InformationWithIcon {...props} />
)

export const Default = Template.bind({})
Default.args = {
  Icon: BicolorClock,
  text: 'Information title',
}

export const InformationWithIconWithSubtitle = Template.bind({})
InformationWithIconWithSubtitle.args = {
  Icon: BicolorClock,
  text: 'Information title',
  subtitle: 'Information subtitle',
}
