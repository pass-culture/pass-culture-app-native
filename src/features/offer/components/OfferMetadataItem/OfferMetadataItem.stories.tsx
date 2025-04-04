import type { Meta } from '@storybook/react'
import React from 'react'

import { OfferMetadataItem } from 'features/offer/components/OfferMetadataItem/OfferMetadataItem'

const meta: Meta<typeof OfferMetadataItem> = {
  title: 'features/offer/OfferMetadataItem',
  component: OfferMetadataItem,
}
export default meta

const Template = (props: React.ComponentProps<typeof OfferMetadataItem>) => (
  <OfferMetadataItem {...props} />
)

export const Default = {
  name: 'OfferMetadataItem',
  render: () => Template({ label: 'Intervenant', value: 'Jean Paul Sartre' }),
}
