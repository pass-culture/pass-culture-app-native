import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { theme } from 'theme'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'
import { ArrowRight } from 'ui/svg/icons/ArrowRight'

import { AttachedCardDisplay } from './AttachedCardDisplay'
const meta: ComponentMeta<typeof AttachedCardDisplay> = {
  title: 'ui/AttachedCardDisplay',
  component: AttachedCardDisplay,
}
export default meta

const baseProps = {
  title: 'La Joconde',
  subtitle: 'Arts visuels',
  details: ['Du 12/06 au 24/06'],
  rightTagLabel: 'Gratuit',
}

const variantConfig = [
  {
    label: 'AttachedCardDisplay default',
    props: baseProps,
  },
  {
    label: 'AttachedCardDisplay with image',
    props: {
      ...baseProps,
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
      ...baseProps,
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
      ...baseProps,
      bottomRightElement: (
        // eslint-disable-next-line react-native/no-inline-styles
        <ArrowRight style={{ flexShrink: 0 }} size={theme.icons.sizes.extraSmall} />
      ),
    },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={AttachedCardDisplay} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'AttachedCardDisplay'
