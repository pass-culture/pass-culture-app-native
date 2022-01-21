import MultiSlider from '@ptomasroos/react-native-multi-slider'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { useTheme } from 'styled-components/native'

import { getSpacing, Spacer, Typo } from 'ui/theme'
import { ColorsEnum } from 'ui/theme/colors'
import { BorderRadiusEnum } from 'ui/theme/grid'

interface Props {
  values?: number[]
  formatValues?: (label: number) => string
  showValues?: boolean
  min?: number
  max?: number
  step?: number
  onValuesChangeFinish?: (newValues: number[]) => void
}
const DEFAULT_MIN = 0
const DEFAULT_MAX = 100
const DEFAULT_STEP = 1
const DEFAULT_VALUES = [DEFAULT_MIN, DEFAULT_MAX]

export const Slider: React.FC<Props> = (props) => {
  const { appContentWidth } = useTheme()

  const [values, setValues] = useState<number[]>(props.values ?? DEFAULT_VALUES)
  const { formatValues = (s: number) => s } = props

  useEffect(() => {
    if (props.values) setValues(props.values)
  }, [props.values])

  return (
    <React.Fragment>
      {!!props.showValues && (
        <Typo.ButtonText>
          {values.length === 1 && formatValues(values[0])}
          {values.length === 2 && `${formatValues(values[0])} - ${formatValues(values[1])}`}
        </Typo.ButtonText>
      )}
      <Spacer.Column numberOfSpaces={4} />
      <View testID="slider">
        <MultiSlider
          values={values}
          allowOverlap={true}
          min={props.min || DEFAULT_MIN}
          max={props.max || DEFAULT_MAX}
          step={props.step || DEFAULT_STEP}
          trackStyle={trackStyle}
          selectedStyle={selectedStyle}
          unselectedStyle={unselectedStyle}
          markerStyle={markerStyle}
          pressedMarkerStyle={markerStyle}
          containerStyle={containerStyle}
          onValuesChange={setValues}
          onValuesChangeFinish={props.onValuesChangeFinish}
          sliderLength={appContentWidth - getSpacing(2 * 2 * 6)}
        />
      </View>
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
const containerStyle = { height: getSpacing(8) }
