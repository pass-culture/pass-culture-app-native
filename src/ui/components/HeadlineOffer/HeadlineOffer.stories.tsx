import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { SHARE_APP_IMAGE_SOURCE } from 'features/share/components/shareAppImage'
import { HeadlineOffer } from 'ui/components/HeadlineOffer/HeadlineOffer'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

const meta: ComponentMeta<typeof HeadlineOffer> = {
  title: 'ui/HeadlineOffer',
  component: HeadlineOffer,
}
export default meta

const variantConfig: Variants<typeof HeadlineOffer> = [
  {
    label: 'HeadlineOffer default',
    props: {
      category: 'Livre',
      offerTitle: 'One Piece Tome 108, hahahahhahahahahhahahahahahahahahahahhahahaha',
      imageUrl: SHARE_APP_IMAGE_SOURCE,
      price: '7,20€',
    },
  },
]

const Template: VariantsStory<typeof HeadlineOffer> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={HeadlineOffer} defaultProps={args} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'HeadlineOffer'
