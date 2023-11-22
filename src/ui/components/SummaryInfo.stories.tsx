import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { theme } from 'theme'
import { SummaryInfo } from 'ui/components/SummaryInfo'
import { CalendarS } from 'ui/svg/icons/CalendarS'
const meta: ComponentMeta<typeof SummaryInfo> = {
  title: 'ui/SummaryInfo',
  component: SummaryInfo,
}
export default meta

const Template: ComponentStory<typeof SummaryInfo> = (props) => <SummaryInfo {...props} />

export const Default = Template.bind({})
Default.args = {
  Icon: <CalendarS size={theme.icons.sizes.small} />,
  title: 'Info name',
}

export const WithSubtitle = Template.bind({})
WithSubtitle.args = {
  Icon: <CalendarS size={theme.icons.sizes.small} />,
  title: 'Info name',
  subtitle: 'Lorem ipsum dolor sit amet consectetur. Hendrerit massa dolor blandit.',
}
