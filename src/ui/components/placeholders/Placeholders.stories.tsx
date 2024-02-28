import React from 'react'

import {
  BookingHitPlaceholder,
  FavoriteHitPlaceholder,
  HitPlaceholder,
  NumberOfBookingsPlaceholder,
  NumberOfResultsPlaceholder,
} from 'ui/components/placeholders/Placeholders'
import { StoryContainer } from 'ui/storybook/StoryContainer'

export default {
  title: 'ui/placeholders',
}

const Template = () => (
  <React.Fragment>
    <StoryContainer title="HitPlaceholder">
      <HitPlaceholder />
    </StoryContainer>
    <StoryContainer title="FavoriteHitPlaceholder">
      <FavoriteHitPlaceholder />
    </StoryContainer>
    <StoryContainer title="BookingHitPlaceholder">
      <BookingHitPlaceholder />
    </StoryContainer>
    <StoryContainer title="NumberOfResultsPlaceholder">
      <NumberOfResultsPlaceholder />
    </StoryContainer>
    <StoryContainer title="NumberOfBookingsPlaceholder">
      <NumberOfBookingsPlaceholder />
    </StoryContainer>
  </React.Fragment>
)

export const Default = Template.bind({})
