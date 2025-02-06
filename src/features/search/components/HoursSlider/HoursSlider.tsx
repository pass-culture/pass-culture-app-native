import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { Hour, hoursSchema } from 'features/search/helpers/schema/datesHoursSchema/datesHoursSchema'
import { useGetFullscreenModalSliderLength } from 'features/search/helpers/useGetFullscreenModalSliderLength'
import { DEFAULT_TIME_VALUE } from 'features/search/pages/modals/DatesHoursModal/DatesHoursModal'
import { Slider, ValuesType } from 'ui/components/inputs/Slider'
import { Spacer, TypoDS } from 'ui/theme'

type HoursSliderProps = {
  value?: [Hour, Hour]
  onChange?: (nextHour: [Hour, Hour]) => void
}

const MAX_HOUR = 24

export function HoursSlider({ field }: Readonly<{ field: HoursSliderProps }>) {
  const { value, onChange } = field
  const { sliderLength } = useGetFullscreenModalSliderLength()
  const [minHour, maxHour] = value || DEFAULT_TIME_VALUE
  const hoursLabelId = uuidv4()

  function handleChange(newValues: ValuesType) {
    if (onChange && hoursSchema.isValidSync(newValues)) {
      onChange(newValues)
    }
  }

  return (
    <View>
      <Spacer.Column numberOfSpaces={3} />
      <LabelHoursContainer nativeID={hoursLabelId}>
        <TypoDS.Body>Sortir entre</TypoDS.Body>
        <TypoDS.BodyAccent>{`${minHour}\u00a0h et ${maxHour}\u00a0h`}</TypoDS.BodyAccent>
      </LabelHoursContainer>
      <Spacer.Column numberOfSpaces={2} />
      <Slider
        showValues={false}
        values={value}
        max={MAX_HOUR}
        onValuesChange={handleChange}
        onValuesChangeFinish={handleChange}
        minLabel="Horaire minimum de sortie&nbsp;:"
        maxLabel="Horaire maximum de sortie&nbsp;:"
        shouldShowMinMaxValues
        minMaxValuesComplement="h"
        sliderLength={sliderLength}
        accessibilityLabelledBy={hoursLabelId}
      />
    </View>
  )
}

const LabelHoursContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
})
