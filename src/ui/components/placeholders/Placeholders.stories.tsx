import { ComponentStory } from '@storybook/react'
import React from 'react'

import { HomeBodyPlaceholder } from 'features/home/components/HomeBodyPlaceholder'
import {
  BookingHitPlaceholder,
  FavoriteHitPlaceholder,
  HitPlaceholder,
  NumberOfBookingsPlaceholder,
  NumberOfResultsPlaceholder,
} from 'ui/components/placeholders/Placeholders'
import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

export default {
  title: 'ui/Placeholders',
}

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <React.Fragment>
    <VariantsTemplate variants={[{ label: 'HitPlaceholder' }]} Component={HitPlaceholder} />
    <VariantsTemplate
      variants={[{ label: 'FavoriteHitPlaceholder' }]}
      Component={FavoriteHitPlaceholder}
    />
    <VariantsTemplate
      variants={[{ label: 'BookingHitPlaceholder' }]}
      Component={BookingHitPlaceholder}
    />
    <VariantsTemplate
      variants={[{ label: 'NumberOfResultsPlaceholder' }]}
      Component={NumberOfResultsPlaceholder}
    />
    <VariantsTemplate
      variants={[{ label: 'NumberOfBookingsPlaceholder' }]}
      Component={NumberOfBookingsPlaceholder}
    />
    <VariantsTemplate
      variants={[{ label: 'HomeBodyPlaceholder' }]}
      Component={HomeBodyPlaceholder}
    />
  </React.Fragment>
)

export const Default = Template.bind({})
Default.storyName = 'Placeholders'
