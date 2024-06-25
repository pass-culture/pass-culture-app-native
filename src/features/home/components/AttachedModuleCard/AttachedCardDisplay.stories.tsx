import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { CategoryIdEnum } from 'api/gen'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { ArrowRight } from 'ui/svg/icons/ArrowRight'

import { AttachedCardDisplay } from './AttachedCardDisplay'
const meta: ComponentMeta<typeof AttachedCardDisplay> = {
  title: 'ui/modules/AttachedCardDisplay',
  component: AttachedCardDisplay,
}
export default meta

const Template: ComponentStory<typeof AttachedCardDisplay> = (props) => (
  <AttachedCardDisplay {...props} />
)

export const Default = Template.bind({})
Default.args = {
  title: 'La Joconde',
  subtitle: 'Arts visuels',
  details: ['Du 12/06 au 24/06'],
  rightTagLabel: 'Gratuit',
}

export const WithImage = Template.bind({})
WithImage.args = {
  title: 'La Joconde',
  subtitle: 'Arts visuels',
  details: ['Du 12/06 au 24/06'],
  rightTagLabel: 'Gratuit',
  LeftImageComponent: () => (
    <OfferImage
      imageUrl="https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW"
      categoryId={CategoryIdEnum.BEAUX_ARTS}
      borderRadius={5}
      withStroke
    />
  ),
}

export const WithMutilpleDetails = Template.bind({})
WithMutilpleDetails.args = {
  title: 'La Joconde',
  subtitle: 'Arts visuels',
  details: ['Du 12/06 au 24/06', 'Duo'],
  rightTagLabel: 'Gratuit',
  LeftImageComponent: () => (
    <OfferImage
      imageUrl="https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW"
      categoryId={CategoryIdEnum.BEAUX_ARTS}
      borderRadius={5}
      withStroke
    />
  ),
}

const ArrowRightIcon = styled(ArrowRight).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))({
  flexShrink: 0,
})

export const WithRightElement = Template.bind({})
WithRightElement.args = {
  title: 'La Joconde',
  subtitle: 'Arts visuels',
  details: ['Du 12/06 au 24/06'],
  rightTagLabel: 'Gratuit',
  bottomRightElement: <ArrowRightIcon />,
}
