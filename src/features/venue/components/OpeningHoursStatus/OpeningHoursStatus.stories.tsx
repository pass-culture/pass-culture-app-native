import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { OpeningHoursStatus } from './OpeningHoursStatus'

const meta: ComponentMeta<typeof OpeningHoursStatus> = {
  title: 'features/venue/OpeningHoursStatus',
  component: OpeningHoursStatus,
}
export default meta

const TIMEZONE = 'UTC'

const openingHours = {
  MONDAY: [{ open: '09:00', close: '19:00' }],
  TUESDAY: [{ open: '09:00', close: '19:00' }],
}

const baseProps = {
  openingHours,
  timezone: TIMEZONE,
}

const variantConfig: Variants<typeof OpeningHoursStatus> = [
  {
    label: 'OpeningHoursStatus close',
    props: {
      ...baseProps,
      currentDate: new Date('2024-05-13T20:00:00Z'),
    },
  },
  {
    label: 'OpeningHoursStatus open',
    props: {
      ...baseProps,
      currentDate: new Date('2024-05-13T12:00:00Z'),
    },
  },
  {
    label: 'OpeningHoursStatus open soon',
    props: {
      ...baseProps,
      currentDate: new Date('2024-05-13T06:00:00Z'),
    },
  },
  {
    label: 'OpeningHoursStatus close soon',
    props: {
      ...baseProps,
      currentDate: new Date('2024-05-13T16:00:00Z'),
    },
  },
]

const Template: VariantsStory<typeof OpeningHoursStatus> = () => (
  <VariantsTemplate variants={variantConfig} Component={OpeningHoursStatus} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'OpeningHoursStatus'
