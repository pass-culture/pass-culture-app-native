import React, { useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { useGetFullscreenModalSliderLength } from 'features/search/helpers/useGetFullscreenModalSliderLength'
import { Slider } from 'ui/components/inputs/Slider'
import { Spacer, Typo } from 'ui/theme'

type LocationSliderProps = {
  defaultValue: number
  onChange: (nextAroundRadius: number[]) => void
}

const formatKm = (km: number) => `${km}\u00a0km`

export function LocationSlider({
  defaultValue = MAX_RADIUS,
  onChange,
}: Readonly<LocationSliderProps>) {
  const [internalValue, setInternalValue] = useState<number[]>([defaultValue])
  const radiusLabelId = uuidv4()
  const { sliderLength } = useGetFullscreenModalSliderLength()

  return (
    <View>
      <Spacer.Column numberOfSpaces={4} />
      <LabelRadiusContainer nativeID={radiusLabelId}>
        <Typo.Body>Dans un rayon de&nbsp;:</Typo.Body>
        <Typo.ButtonText>{`${internalValue}\u00a0km`}</Typo.ButtonText>
      </LabelRadiusContainer>

      <Spacer.Column numberOfSpaces={2} />

      <Slider
        showValues={false}
        values={[defaultValue]}
        max={MAX_RADIUS}
        onValuesChange={setInternalValue}
        onValuesChangeFinish={onChange}
        shouldShowMinMaxValues
        minMaxValuesComplement="&nbsp;km"
        maxLabel="Dans un rayon de&nbsp;:"
        sliderLength={sliderLength}
        formatValues={formatKm}
        accessibilityLabelledBy={radiusLabelId}
      />
    </View>
  )
}

const LabelRadiusContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
})
