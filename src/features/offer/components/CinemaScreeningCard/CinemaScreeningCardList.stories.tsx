import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { action } from 'storybook/actions'

import { CinemaScreeningCardList } from './CinemaScreeningCardList'
import { CinemaScreeningCardProps } from './types'

const createScreening = (
  time: string,
  props: Partial<CinemaScreeningCardProps> = {}
): CinemaScreeningCardProps => ({
  time,
  languages: ['VO'],
  price: '25€',
  onPress: action(`pressed-${time}`),
  ...props,
})

const meta: Meta<typeof CinemaScreeningCardList> = {
  title: 'features/offer/CinemaScreeningCardList',
  component: CinemaScreeningCardList,
  args: {
    screenings: [
      createScreening('17h'),
      createScreening('18h', { specialEvent: 'Avant-première équipe' }),
      createScreening('19h', {
        specialEvent: 'Avant-première équipe',
        video: ['DolbyVision'],
        audio: ['Auro3D'],
        accessibility: {
          visual: ['value'],
          audio: ['GRETA'],
          mental: ['value'],
          motor: ['value'],
        },
      }),
    ],
  },
  argTypes: {
    screenings: {
      control: 'object',
      description: 'Séances affichées dans la playlist',
    },
  },
}

export default meta

type Story = StoryObj<typeof CinemaScreeningCardList>

export const Playground: Story = {
  name: 'CinemaScreeningCardList',
  render: (args) => <CinemaScreeningCardList {...args} />,
}
