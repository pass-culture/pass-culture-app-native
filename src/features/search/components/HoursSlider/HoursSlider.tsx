import React, { useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useGetFullscreenModalSliderLength } from 'features/search/helpers/useGetFullscreenModalSliderLength'
import { DEFAULT_TIME_VALUE } from 'features/search/pages/modals/DatesHoursModal/DatesHoursModal'
import { Slider, ValuesType } from 'ui/components/inputs/Slider'
import { Spacer, Typo } from 'ui/theme'

export type Hour =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24

export type HoursSliderProps = {
  defaultValue: [Hour, Hour]
  onChange: (nextHour: [Hour, Hour]) => void
}

const MAX_HOUR = 24

export function HoursSlider({ defaultValue, onChange }: Readonly<HoursSliderProps>) {
  const [internalValue, setInternalValue] = useState<number[]>(defaultValue)
  const { sliderLength } = useGetFullscreenModalSliderLength()
  const [minHour, maxHour] = internalValue || DEFAULT_TIME_VALUE
  const hoursLabelId = uuidv4()

  function handleChange(newValues: ValuesType) {
    onChange(newValues as [Hour, Hour])
  }

  return (
    <View>
      <Spacer.Column numberOfSpaces={4} />
      <LabelHoursContainer nativeID={hoursLabelId}>
        <Typo.Body>Sortir entre</Typo.Body>
        <Typo.ButtonText>{`${minHour}\u00a0h et ${maxHour}\u00a0h`}</Typo.ButtonText>
      </LabelHoursContainer>
      <Spacer.Column numberOfSpaces={2} />
      <Slider
        showValues={false}
        values={defaultValue}
        max={MAX_HOUR}
        onValuesChange={setInternalValue}
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
