import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { theme } from 'theme'
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

export const WithRightElement = Template.bind({})
WithRightElement.args = {
  title: 'La Joconde',
  subtitle: 'Arts visuels',
  details: ['Du 12/06 au 24/06'],
  rightTagLabel: 'Gratuit',
  // we inline because when we use styled we get the ts error : 'Type of property 'defaultProps' circularly references itself in mapped type'
  // eslint-disable-next-line react-native/no-inline-styles
  bottomRightElement: <ArrowRight style={{ flexShrink: 0 }} size={theme.icons.sizes.extraSmall} />,
}
