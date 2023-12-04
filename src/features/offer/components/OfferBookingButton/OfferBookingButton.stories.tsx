import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { View, StyleSheet } from 'react-native'

import { OfferBookingButton } from 'features/offer/components/OfferBookingButton/OfferBookingButton'

const meta: ComponentMeta<typeof OfferBookingButton> = {
  title: 'features/offer/OfferBookingButton',
  component: OfferBookingButton,
}
export default meta

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
    backgroundImage:
      "url('https://img.freepik.com/photos-gratuite/peinture-lac-montagne-montagne-arriere-plan_188544-9126.jpg?w=1380&t=st=1701705399~exp=1701705999~hmac=c2bf28443a351fb39a524c2fb4603030acdca56b8d6d165a5dccaf922265f073')",
    backgroundSize: 'cover',
    position: 'relative',
  },
})

const Template: ComponentStory<typeof OfferBookingButton> = (props) => (
  <View style={styles.container}>
    <OfferBookingButton {...props} />
  </View>
)

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
    wording: "C'est gratuit",
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
