/**
 * These stories are written using old Storybook format because
 * we automatically generate stories, and it's not possible
 * using CSF.
 */

import { storiesOf } from '@storybook/react'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { MAP_TYPE_TO_ICON, VenueTypeCode } from 'libs/parsers'

import { VenueDetails } from './VenueDetails'

const stories = storiesOf('features/offer/VenueDetails', module)

stories.add('Default', () => (
  <VenueDetails
    title="Envie de lire"
    address="Ivry-sur-Seine 94200, 16 rue Gabriel Peri"
    venueType={null}
    imageUrl="https://www.luxetdeco.fr/13030-thickbox_default/livre-lumineux-iron-man-marvel.jpg"
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

stories.add('Wrapped', () => (
  <View style={styles.wrapper}>
    <VenueDetails
      title="Envie de lire"
      address="Ivry-sur-Seine 94200, 16 rue Gabriel Peri"
      venueType={null}
      imageUrl="https://www.luxetdeco.fr/13030-thickbox_default/livre-lumineux-iron-man-marvel.jpg"
      distance="500m"
    />
  </View>
))

Object.keys(MAP_TYPE_TO_ICON).forEach((venueType) =>
  stories.add(venueType, () => (
    <View style={styles.wrapper}>
      <VenueDetails
        title="Envie de lire"
        address="Ivry-sur-Seine 94200, 16 rue Gabriel Peri"
        venueType={venueType as VenueTypeCode}
        distance="500m"
      />
    </View>
  ))
)

const styles = StyleSheet.create({
  wrapper: {
    maxWidth: 320,
  },
})
