import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { StickyBookingButton } from 'features/offer/components/StickyBookingButton/StickyBookingButton'
import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

const meta: ComponentMeta<typeof StickyBookingButton> = {
  title: 'features/offer/StickyBookingButton',
  component: StickyBookingButton,
}
export default meta

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
    backgroundImage:
      'url("https://img.freepik.com/photos-gratuite/peinture-lac-montagne-montagne-arriere-plan_188544-9126.jpg?w=1380&t=st=1701705399~exp=1701705999~hmac=c2bf28443a351fb39a524c2fb4603030acdca56b8d6d165a5dccaf922265f073")',
    backgroundSize: 'cover',
    position: 'relative',
  },
})

const variantConfig = [
  {
    label: 'StickyBookingButton default',
    props: {
      ctaWordingAndAction: {
        wording: 'Réserver l’offre',
        isDisabled: false,
      },
      isFreeDigitalOffer: false,
      isLoggedIn: false,
    },
    minHeight: 170,
  },
  {
    label: 'StickyBookingButton for free digital offer And user logged',
    props: {
      ctaWordingAndAction: {
        wording: 'C’est gratuit',
        isDisabled: false,
      },
      isFreeDigitalOffer: true,
      isLoggedIn: true,
    },
    minHeight: 100,
  },
  {
    label: 'StickyBookingButton disabled',
    props: {
      ctaWordingAndAction: {
        wording: 'Réserver l’offre',
        isDisabled: true,
      },
      isFreeDigitalOffer: false,
      isLoggedIn: false,
    },
    minHeight: 100,
  },
  {
    label: 'StickyBookingButton disabled with bottom banner',
    props: {
      ctaWordingAndAction: {
        wording: 'Réserver l’offre',
        isDisabled: true,
        bottomBannerText: 'Disable et avec la bannière de warning',
      },
      isFreeDigitalOffer: false,
      isLoggedIn: false,
    },
    minHeight: 150,
  },
  {
    label: 'StickyBookingButton with bottom banner',
    props: {
      ctaWordingAndAction: {
        wording: 'Réserver l’offre',
        isDisabled: false,
        bottomBannerText: 'Avec la bannière de warning',
      },
      isFreeDigitalOffer: false,
      isLoggedIn: false,
    },
    minHeight: 150,
  },
]

const Template: ComponentStory<typeof StickyBookingButton> = () => (
  <View style={styles.container}>
    <VariantsTemplate variants={variantConfig} Component={StickyBookingButton} />
  </View>
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'StickyBookingButton'
