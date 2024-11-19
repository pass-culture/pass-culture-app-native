import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { OfferMetadataList } from 'features/offer/components/OfferMetadataList/OfferMetadataList'
import { getOfferMetadata } from 'features/offer/helpers/getOfferMetadata/getOfferMetadata'

const meta: ComponentMeta<typeof OfferMetadataList> = {
  title: 'features/offer/OfferMetadataList',
  component: OfferMetadataList,
}
export default meta

const Template: ComponentStory<typeof OfferMetadataList> = (props) => (
  <OfferMetadataList {...props} />
)

const metadata = getOfferMetadata({
  releaseDate: '2023-09-01',
  speaker: 'Jean Paul Sartre',
  editeur: 'Gallimard',
  cast: ['Pauline Auriol', 'Axel Prioton Alcala', 'Valentin Santes', 'Pierre Louis Sémézis'],
})

export const Default = Template.bind({})
Default.args = {
  metadata,
}
Default.storyName = 'OfferMetadataList'
