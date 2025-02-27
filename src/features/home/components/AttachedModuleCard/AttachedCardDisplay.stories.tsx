import { Meta } from '@storybook/react'
import React, { type ComponentProps } from 'react'

import { CategoryIdEnum } from 'api/gen'
import { theme } from 'theme'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { ArrowRight } from 'ui/svg/icons/ArrowRight'

import { AttachedCardDisplay } from './AttachedCardDisplay'
const meta: Meta<typeof AttachedCardDisplay> = {
  title: 'ui/AttachedCardDisplay',
  component: AttachedCardDisplay,
}
export default meta

const baseProps: ComponentProps<typeof AttachedCardDisplay> = {
  title: 'La Joconde',
  subtitle: 'Arts visuels',
  details: ['Du 12/06 au 24/06'],
  rightTagLabel: 'Gratuit',
}

const variantConfig: Variants<typeof AttachedCardDisplay> = [
  {
    label: 'AttachedCardDisplay default',
  },
  {
    label: 'AttachedCardDisplay with image',
    props: {
      LeftImageComponent: () => (
        <OfferImage
          imageUrl="https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW"
          categoryId={CategoryIdEnum.BEAUX_ARTS}
          borderRadius={5}
          withStroke
        />
      ),
    },
  },
  {
    label: 'AttachedCardDisplay with multiple details',
    props: {
      details: ['Du 12/06 au 24/06', 'Duo'],
      LeftImageComponent: () => (
        <OfferImage
          imageUrl="https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW"
          categoryId={CategoryIdEnum.BEAUX_ARTS}
          borderRadius={5}
          withStroke
        />
      ),
    },
  },
  {
    label: 'AttachedCardDisplay with right element',
    props: {
      bottomRightElement: (
        // eslint-disable-next-line react-native/no-inline-styles
        <ArrowRight style={{ flexShrink: 0 }} size={theme.icons.sizes.extraSmall} />
      ),
    },
  },
  {
    label: 'AttachedCardDisplay with coming soon info',
    props: {
      bottomBannerText: 'Disponible le 17 février',
      details: ['Du 12/06 au 24/06', 'Duo'],
      LeftImageComponent: () => (
        <OfferImage
          imageUrl="https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW"
          categoryId={CategoryIdEnum.BEAUX_ARTS}
          borderRadius={5}
          withStroke
        />
      ),
    },
  },
]

const Template: VariantsStory<typeof AttachedCardDisplay> = (args) => (
  <VariantsTemplate
    variants={variantConfig}
    Component={AttachedCardDisplay}
    defaultProps={{ ...baseProps, ...args }}
  />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'AttachedCardDisplay'
