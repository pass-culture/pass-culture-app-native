import { action } from '@storybook/addon-actions'
import { ComponentStory } from '@storybook/react'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { VenueCard, VenueCardProps } from './VenueCard'

export default {
  title: 'features/offer/VenueCard',
  component: VenueCard,
}

const Template: ComponentStory<typeof VenueCard> = (props: VenueCardProps) => (
  <VenueCard {...props} />
)

const WrappedTemplate: ComponentStory<typeof VenueCard> = (props) => (
  <View style={styles.wrapper}>
    <Template {...props} />
  </View>
)

export const Default = Template.bind({})
Default.args = {
  title: 'Title',
  address: 'Ivry-sur-Seine 94200, 16 rue Gabriel Peri',
  distance: '500m',
  onPress: action('pressed!'),
}

export const Wrapped = WrappedTemplate.bind({})
Wrapped.args = {
  title: 'Title',
  address: 'Ivry-sur-Seine 94200, 16 rue Gabriel Peri',
  distance: '500m',
  onPress: action('pressed!'),
}

const styles = StyleSheet.create({
  wrapper: {
    maxWidth: 320,
  },
})
