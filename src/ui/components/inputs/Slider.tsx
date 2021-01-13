import MultiSlider from '@ptomasroos/react-native-multi-slider'
import React, { useState } from 'react'

import { ColorsEnum, getSpacing, Typo } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

interface Props {
  values?: number[]
  formatValues?: (label: number) => string
  showValues?: boolean
  min?: number
  max?: number
  step?: number
}

export const Slider: React.FC<Props> = (props) => {
  const { showValues, formatValues = (s: number) => s } = props
  const [values, setValues] = useState<number[]>(props.values || [0, 100])

  return (
    <React.Fragment>
      {showValues && (
        <Typo.ButtonText>
          {values.length === 1 && formatValues(values[0])}
          {values.length === 2 && `${formatValues(values[0])} - ${formatValues(values[1])}`}
        </Typo.ButtonText>
      )}
      <MultiSlider
        values={values}
        allowOverlap={true}
        min={props.min || 0}
        max={props.max || 100}
        step={props.step || 1}
        trackStyle={trackStyle}
        selectedStyle={selectedStyle}
        unselectedStyle={unselectedStyle}
        markerStyle={markerStyle}
        pressedMarkerStyle={markerStyle}
        onValuesChange={setValues}
      />
    </React.Fragment>
  )
}

const markerStyle = {
  height: getSpacing(7),
  width: getSpacing(7),
  borderRadius: getSpacing(7),
  borderColor: ColorsEnum.WHITE,
  backgroundColor: ColorsEnum.WHITE,
  shadowColor: ColorsEnum.BLACK,
  shadowRadius: getSpacing(1),
  shadowOpacity: 0.2,
  elevation: 4,
}

const trackStyle = { height: 15, marginTop: -7, borderRadius: BorderRadiusEnum.BUTTON }
const selectedStyle = { backgroundColor: ColorsEnum.PRIMARY }
const unselectedStyle = { backgroundColor: ColorsEnum.GREY_MEDIUM }
