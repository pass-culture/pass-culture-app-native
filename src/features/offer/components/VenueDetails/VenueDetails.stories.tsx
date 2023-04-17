import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { VenueDetails } from './VenueDetails'

export default {
  title: 'features/offer/VenueDetails',
  component: VenueDetails,
} as ComponentMeta<typeof VenueDetails>

const Template: ComponentStory<typeof VenueDetails> = (props) => <VenueDetails {...props} />
const WrappedTemplate: ComponentStory<typeof VenueDetails> = (props) => (
  <View style={styles.wrapper}>
    <VenueDetails {...props} />
  </View>
)

export const Default = Template.bind({})
Default.args = {
  title: 'Envie de lire',
  address: 'Ivry-sur-Seine 94200, 16 rue Gabriel Peri',
}

export const WithDistance = Template.bind({})
WithDistance.args = {
  title: 'Envie de lire',
  address: 'Ivry-sur-Seine 94200, 16 rue Gabriel Peri',
  distance: '500 m',
}

export const Wrapped = WrappedTemplate.bind({})
WrappedTemplate.args = {
  title: 'Envie de lire',
  address: 'Ivry-sur-Seine 94200, 16 rue Gabriel Peri',
  distance: '500 m',
}

const styles = StyleSheet.create({
  wrapper: {
    maxWidth: 320,
  },
})
