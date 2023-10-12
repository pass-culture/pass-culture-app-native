import React, { useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useGetFullscreenModalSliderLength } from 'features/search/helpers/useGetFullscreenModalSliderLength'
import { Range } from 'libs/typesUtils/typeHelpers'
import { Slider } from 'ui/components/inputs/Slider'
import { Spacer, Typo } from 'ui/theme'

export type HoursSliderProps = {
  defaultValue: Range<number>
  onChange: (nextHours: number[]) => void
}

const MAX_HOUR = 24
const hoursLabelId = uuidv4()

const formatHour = (hour: number) => `${hour}h`

export function HoursSlider({ defaultValue, onChange }: Readonly<HoursSliderProps>) {
  const [internalValue, setInternalValue] = useState<number[]>(defaultValue)
  const { sliderLength } = useGetFullscreenModalSliderLength()
  const [minHour, maxHour] = internalValue || [0, 24]

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
        formatValues={formatHour}
        onValuesChange={setInternalValue}
        onValuesChangeFinish={onChange}
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
