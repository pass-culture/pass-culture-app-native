import type { Meta } from '@storybook/react'
import React from 'react'

import { OfferAccessibility } from 'features/offer/components/OfferAccessibility/OfferAccessibility'

const meta: Meta<typeof OfferAccessibility> = {
  title: 'features/offer/OfferAccessibility',
  component: OfferAccessibility,
}
export default meta

const Template = (props: React.ComponentProps<typeof OfferAccessibility>) => (
  <OfferAccessibility {...props} />
)

export const Default = {
  name: 'OfferAccessibility',
  render: () =>
    Template({
      accessibility: {
        audioDisability: true,
        mentalDisability: true,
        motorDisability: false,
        visualDisability: true,
      },
    }),
}
