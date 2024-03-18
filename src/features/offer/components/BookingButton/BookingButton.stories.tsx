import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { BookingButton } from 'features/offer/components/BookingButton/BookingButton'

const meta: ComponentMeta<typeof BookingButton> = {
  title: 'features/offer/BookingButton',
  component: BookingButton,
}
export default meta

const Template: ComponentStory<typeof BookingButton> = (props) => <BookingButton {...props} />

export const Default = Template.bind({})
Default.args = {
  ctaWordingAndAction: {
    wording: 'Réserver l’offre',
    isDisabled: false,
  },
  isFreeDigitalOffer: false,
  isLoggedIn: false,
}

export const IsFreeDigitalOfferAndIsLoggedIn = Template.bind({})
IsFreeDigitalOfferAndIsLoggedIn.args = {
  ctaWordingAndAction: {
    wording: 'C’est gratuit',
    isDisabled: false,
  },
  isFreeDigitalOffer: true,
  isLoggedIn: true,
}

export const Disable = Template.bind({})
Disable.args = {
  ctaWordingAndAction: {
    wording: 'Réserver l’offre',
    isDisabled: true,
  },
  isFreeDigitalOffer: false,
  isLoggedIn: false,
}

export const DisableAndWithBottomBanner = Template.bind({})
DisableAndWithBottomBanner.args = {
  ctaWordingAndAction: {
    wording: 'Réserver l’offre',
    isDisabled: true,
    bottomBannerText: 'Disable et avec la bannière de warning',
  },
  isFreeDigitalOffer: false,
  isLoggedIn: false,
}

export const WithBottomBanner = Template.bind({})
WithBottomBanner.args = {
  ctaWordingAndAction: {
    wording: 'Réserver l’offre',
    isDisabled: false,
    bottomBannerText: 'Avec la bannière de warning',
  },
  isFreeDigitalOffer: false,
  isLoggedIn: false,
}
