import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { OpeningHoursStatus } from './OpeningHoursStatus'

const meta: ComponentMeta<typeof OpeningHoursStatus> = {
  title: 'features/venue/OpeningHoursStatus',
  component: OpeningHoursStatus,
}
export default meta

const Template: ComponentStory<typeof OpeningHoursStatus> = (props) => (
  <OpeningHoursStatus {...props} currentDate={new Date(props.currentDate)} />
)

const TIMEZONE = 'UTC'

const openingHours = {
  MONDAY: [{ open: '09:00', close: '19:00' }],
  TUESDAY: [{ open: '09:00', close: '19:00' }],
}

export const Close = Template.bind({})
Close.args = {
  openingHours,
  currentDate: new Date('2024-05-13T20:00:00Z'),
  timezone: TIMEZONE,
}

export const Open = Template.bind({})
Open.args = {
  openingHours,
  currentDate: new Date('2024-05-13T12:00:00Z'),
  timezone: TIMEZONE,
}

export const OpenSoon = Template.bind({})
OpenSoon.args = {
  openingHours,
  currentDate: new Date('2024-05-13T06:00:00Z'),
  timezone: TIMEZONE,
}

export const CloseSoon = Template.bind({})
CloseSoon.args = {
  openingHours,
  currentDate: new Date('2024-05-13T16:00:00Z'),
  timezone: TIMEZONE,
}
