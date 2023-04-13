/**
 * These stories are written using old Storybook format because
 * we automatically generate stories, and it's not possible
 * using CSF.
 */

import { storiesOf } from '@storybook/react'
import React from 'react'

import { MAP_TYPE_TO_ICON, VenueTypeCode } from 'libs/parsers'

import { VenueDetails } from './VenueDetails'

const stories = storiesOf('features/offer/VenueDetails', module)

stories.add('Default', () => (
  <VenueDetails
    title="Envie de lire"
    address="Ivry-sur-Seine 94200, 16 rue Gabriel Peri"
    venueType={null}
    imageUrl="https://img-19.ccm2.net/8vUCl8TXZfwTt7zAOkBkuDRHiT8=/1240x/smart/b829396acc244fd484c5ddcdcb2b08f3/ccmcms-commentcamarche/20494859.jpg"
  />
))

stories.add('Without image', () => (
  <VenueDetails
    title="Envie de lire"
    address="Ivry-sur-Seine 94200, 16 rue Gabriel Peri"
    venueType={null}
  />
))

stories.add('With distance', () => (
  <VenueDetails
    title="Envie de lire"
    address="Ivry-sur-Seine 94200, 16 rue Gabriel Peri"
    venueType={null}
    distance="500m"
  />
))

Object.keys(MAP_TYPE_TO_ICON).forEach((venueType) =>
  stories.add(venueType, () => (
    <VenueDetails
      title="Envie de lire"
      address="Ivry-sur-Seine 94200, 16 rue Gabriel Peri"
      venueType={venueType as VenueTypeCode}
      distance="500m"
    />
  ))
)
