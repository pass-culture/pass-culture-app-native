import { ComponentStory } from '@storybook/react'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { HoursSlider, HoursSliderProps } from 'features/search/components/HoursSlider/HoursSlider'

export default {
  title: 'features/search/HoursSlider',
  component: HoursSlider,
}

const WrappedTemplate: ComponentStory<typeof HoursSlider> = ({
  field,
}: {
  field: HoursSliderProps
}) => (
  <View style={styles.wrapper}>
    <HoursSlider field={field} />
  </View>
)

export const Default = WrappedTemplate.bind({})
Default.args = {
  field: { value: [8, 22] },
}

const styles = StyleSheet.create({
  wrapper: {
    maxWidth: 500,
  },
})
