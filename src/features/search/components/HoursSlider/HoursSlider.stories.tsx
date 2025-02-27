import { StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { HoursSlider } from 'features/search/components/HoursSlider/HoursSlider'
import { Hour } from 'features/search/helpers/schema/datesHoursSchema/datesHoursSchema'

export default {
  title: 'features/search/HoursSlider',
  component: HoursSlider,
}

const WrappedTemplate: StoryObj<typeof HoursSlider> = ({ field }) => {
  const [value, setValue] = useState<[Hour, Hour] | undefined>(field.value)

  return (
    <View style={styles.wrapper}>
      <HoursSlider field={{ value: value, onChange: setValue }} />
    </View>
  )
}

export const Default = WrappedTemplate.bind({})
Default.args = {
  field: { value: [8, 22] },
}

const styles = StyleSheet.create({
  wrapper: {
    maxWidth: 500,
  },
})
