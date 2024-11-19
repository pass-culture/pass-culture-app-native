import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { BookingButton } from 'features/offer/components/BookingButton/BookingButton'
import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

const meta: ComponentMeta<typeof BookingButton> = {
  title: 'features/offer/BookingButton',
  component: BookingButton,
}
export default meta

const variantConfig = [
  {
    label: 'BookingButton default',
    props: {
      ctaWordingAndAction: {
        wording: 'Réserver l’offre',
        isDisabled: false,
      },
      isFreeDigitalOffer: false,
      isLoggedIn: false,
    },
  },
  {
    label: 'BookingButton free digital offer and user logged',
    props: {
      ctaWordingAndAction: {
        wording: 'C’est gratuit',
        isDisabled: false,
      },
      isFreeDigitalOffer: true,
      isLoggedIn: true,
    },
  },
  {
    label: 'BookingButton disabled',
    props: {
      ctaWordingAndAction: {
        wording: 'Réserver l’offre',
        isDisabled: true,
      },
      isFreeDigitalOffer: false,
      isLoggedIn: false,
    },
  },
  {
    label: 'BookingButton disabled and with bottom banner',
    props: {
      ctaWordingAndAction: {
        wording: 'Réserver l’offre',
        isDisabled: true,
        bottomBannerText: 'Disable et avec la bannière de warning',
      },
      isFreeDigitalOffer: false,
      isLoggedIn: false,
    },
  },
  {
    label: 'BookingButton with bottom banner',
    props: {
      ctaWordingAndAction: {
        wording: 'Réserver l’offre',
        isDisabled: false,
        bottomBannerText: 'Avec la bannière de warning',
      },
      isFreeDigitalOffer: false,
      isLoggedIn: false,
    },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={BookingButton} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'BookingButton'
