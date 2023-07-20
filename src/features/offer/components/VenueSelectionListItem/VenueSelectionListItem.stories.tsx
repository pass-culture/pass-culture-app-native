import { action } from '@storybook/addon-actions'
import { ComponentStory } from '@storybook/react'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { VenueSelectionListItem } from './VenueSelectionListItem'

export default {
  title: 'features/offer/VenueSelectionListItem',
  component: VenueSelectionListItem,
  parameters: {
    docs: {
      description: {
        component:
          'This component uses `SelectableListItem` internally.\n\n' +
          'It it used to display a venue list item that can be selected.',
      },
    },
  },
  argTypes: {
    onSelect: { control: { disable: true } },
  },
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
  isSelected: false,
  onSelect: action('select'),
}

export const Wrapped = WrappedTemplate.bind({})
Wrapped.args = {
  title: 'Title',
  address: 'Ivry-sur-Seine 94200, 16 rue Gabriel Peri',
  distance: '500m',
  isSelected: false,
  onSelect: action('select'),
}

const styles = StyleSheet.create({
  wrapper: {
    maxWidth: 320,
  },
})
