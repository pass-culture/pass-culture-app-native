import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { action } from 'storybook/actions'

import { CinemaScreeningCard } from './CinemaScreeningCard'
import { CinemaScreeningCardDisabledReason } from './types'

const meta: Meta<typeof CinemaScreeningCard> = {
  title: 'features/offer/CinemaScreeningCard',
  component: CinemaScreeningCard,
  args: {
    time: '17h',
    languages: ['VO'],
    price: '25€',
    video: [],
    audio: [],
    accessibility: {},
    onPress: action('pressed'),
  },
  argTypes: {
    time: {
      control: 'text',
      description: 'Heure de la séance',
    },
    languages: {
      control: 'object',
      description: 'Langues de la séance',
    },
    price: {
      control: 'text',
      description: 'Prix de la séance',
    },
    specialEvent: {
      control: 'text',
      description: 'Événement spécial affiché dans le tag Highlight',
    },
    video: {
      control: 'object',
      description: 'Formats vidéo affichés avant les formats audio',
    },
    audio: {
      control: 'object',
      description: 'Formats audio',
    },
    accessibility: {
      control: 'object',
      description: 'Informations d’accessibilité regroupées par catégorie',
    },
    disabledReason: {
      control: 'select',
      options: [
        undefined,
        CinemaScreeningCardDisabledReason.UNAVAILABLE,
        CinemaScreeningCardDisabledReason.INSUFFICIENT_CREDIT,
      ],
      description: 'Raison pour laquelle la séance est indisponible',
    },
    fillHeight: { table: { disable: true } },
    onPress: { table: { disable: true } },
  },
}

export default meta

type Story = StoryObj<typeof CinemaScreeningCard>

export const Playground: Story = {
  name: 'CinemaScreeningCard',
  render: (args) => <CinemaScreeningCard {...args} />,
}
