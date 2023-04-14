import { action } from '@storybook/addon-actions'
import { ComponentStory } from '@storybook/react'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { VenueTypeCodeKey } from 'api/gen'

import { VenueSelectionListItem } from './VenueSelectionListItem'

export default {
  title: 'features/offer/VenueSelectionListItem',
  component: VenueSelectionListItem,
}

const Template: ComponentStory<typeof VenueSelectionListItem> = (props) => (
  <VenueSelectionListItem {...props} />
)

const WrappedTemplate: ComponentStory<typeof VenueSelectionListItem> = (props) => (
  <View style={styles.wrapper}>
    <VenueSelectionListItem {...props} />
  </View>
)

export const Default = Template.bind({})
Default.args = {
  title: 'Title',
  address: 'Ivry-sur-Seine 94200, 16 rue Gabriel Peri',
  distance: '500m',
  venueType: VenueTypeCodeKey.MUSEUM,
  imageUrl: 'https://www.luxetdeco.fr/13030-thickbox_default/livre-lumineux-iron-man-marvel.jpg',
  isSelected: false,
  onSelect: action('select'),
}

export const Wrapped = WrappedTemplate.bind({})
Wrapped.args = {
  title: 'Title',
  address: 'Ivry-sur-Seine 94200, 16 rue Gabriel Peri',
  distance: '500m',
  venueType: VenueTypeCodeKey.MUSEUM,
  imageUrl: 'https://www.luxetdeco.fr/13030-thickbox_default/livre-lumineux-iron-man-marvel.jpg',
  isSelected: false,
  onSelect: action('select'),
}

const styles = StyleSheet.create({
  wrapper: {
    maxWidth: 320,
  },
})
