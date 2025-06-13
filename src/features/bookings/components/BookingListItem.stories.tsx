import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react'
import React from 'react'

import { BookingListItem, BookingListItemProp } from 'features/bookings/components/BookingListItem'
import { BookingListItemLabel } from 'features/bookings/components/BookingListItemLabel'
import { theme } from 'theme'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

const meta: Meta<typeof BookingListItem> = {
  title: 'features/booking/BookingListItem',
  component: BookingListItem,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const variantConfig: Variants<typeof BookingListItem> = [
  {
    label: 'BookingListItem display full default',
    props: {
      imageUrl:
        'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW',
      title: 'Parasites',
      subtitle: 'Librairie La Brèche',
      display: 'full',
      children: <BookingListItemLabel text="À retirer avant le 8 décembre 2025" icon="tickets" />,
    },
  },
  {
    label: 'BookingListItem display full with alert',
    props: {
      imageUrl:
        'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW',
      title: 'Parasites',
      subtitle: 'Librairie La Brèche',
      display: 'full',
      children: <BookingListItemLabel text="Dernier jour pour retirer" alert icon="clock" />,
    },
  },
  {
    label: 'BookingListItem display punched default',
    props: {
      imageUrl:
        'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW',
      title: 'Un titre quand même pas mal long pour tester',
      subtitle: 'Un cinéma qui lui aussi a un nom pas mal long',
      display: 'punched',
      children: <BookingListItemLabel text="À retirer avant le 8 mai 2025" icon="clock" />,
    },
  },
]

export const Template: VariantsStory<typeof BookingListItem> = {
  name: 'BookingListItem',
  render: (props: BookingListItemProp) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={BookingListItem}
      defaultProps={{ ...props }}
    />
  ),
  parameters: {
    chromatic: { viewports: [theme.breakpoints.xs, theme.breakpoints.xl] },
  },
}
