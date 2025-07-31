import { StoryFn } from '@storybook/react-vite'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { HoursSlider } from 'features/search/components/HoursSlider/HoursSlider'
import { Hour } from 'features/search/helpers/schema/datesHoursSchema/datesHoursSchema'

export default {
  title: 'features/search/HoursSlider',
  component: HoursSlider,
}

const WrappedTemplate: StoryFn<typeof HoursSlider> = (args) => {
  const defaultValue: [Hour, Hour] = [0, 24]
  const [value, setValue] = useState<[Hour, Hour]>(args.field.value || defaultValue)

  return (
    <View style={styles.wrapper}>
      <HoursSlider field={{ value, onChange: setValue }} />
    </View>
  )
}

export const Default = WrappedTemplate.bind({})
Default.args = { field: { value: [8, 22] } }

const styles = StyleSheet.create({
  wrapper: {
    maxWidth: 500,
  },
})
