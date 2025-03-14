import type { Meta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { StickyBookingButton } from 'features/offer/components/StickyBookingButton/StickyBookingButton'
import { SHARE_APP_IMAGE_SOURCE } from 'features/share/components/shareAppImage'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

const meta: Meta<typeof StickyBookingButton> = {
  title: 'features/offer/StickyBookingButton',
  component: StickyBookingButton,
}
export default meta

const variantConfig: Variants<typeof StickyBookingButton> = [
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

const Template: VariantsStory<typeof StickyBookingButton> = () => (
  <ImageBackground source={SHARE_APP_IMAGE_SOURCE}>
    <VariantsTemplate variants={variantConfig} Component={StickyBookingButton} />
  </ImageBackground>
)

export const AllVariants = Template.bind({})

const ImageBackground = styled.ImageBackground({
  width: '100%',
  height: '200px',
  position: 'relative',
})
