import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { VolunteerCard } from './VolunteerCard'

const meta: Meta<typeof VolunteerCard> = {
  title: 'features/venue/VolunteerCard',
  component: VolunteerCard,
}
export default meta

const baseProps = {
  height: 200,
  width: 327,
  isFocus: false,
  venueName: 'On cherche des bénévoles',
  volunteeringUrl: 'https://www.jeveuxaider.gouv.fr/',
  accessibilityLabel: 'Devenir bénévole pour On cherche des bénévoles - Ouvre JeVeuxAider.gouv.fr',
}

const variantConfig: Variants<typeof VolunteerCard> = [
  {
    label: 'VolunteerCard with small screen',
    props: { ...baseProps },
  },
  {
    label: 'VolunteerCard with large screen',
    props: { ...baseProps, width: 976 },
  },
  {
    label: 'VolunteerCard disabled',
    props: {
      ...baseProps,
      volunteeringUrl: undefined,
    },
  },
]

export const Template: VariantsStory<typeof VolunteerCard> = {
  name: 'VolunteerCard',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={VolunteerCard}
      defaultProps={{ ...props }}
    />
  ),
}
