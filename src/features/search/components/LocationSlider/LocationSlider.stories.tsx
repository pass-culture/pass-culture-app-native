import { ComponentStory } from '@storybook/react'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import {
  LocationSlider,
  LocationSliderProps,
} from 'features/search/components/LocationSlider/LocationSlider'
import { ValuesType } from 'ui/components/inputs/Slider'

export default {
  title: 'features/search/LocationSlider',
  component: LocationSlider,
}

const WrappedTemplate: ComponentStory<typeof LocationSlider> = ({
  field,
}: {
  field: LocationSliderProps
}) => {
  const [value, setValue] = useState<ValuesType | undefined>(field.value)

  return (
    <View style={styles.wrapper}>
      <LocationSlider field={{ value: value, onChange: setValue }} />
    </View>
  )
}

export const Default = WrappedTemplate.bind({})
Default.args = {
  field: { value: [50] },
}

const styles = StyleSheet.create({
  wrapper: {
    maxWidth: 500,
  },
})
