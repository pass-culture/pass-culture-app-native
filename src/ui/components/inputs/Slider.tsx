import MultiSlider from '@ptomasroos/react-native-multi-slider'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import { useTheme } from 'styled-components/native'

import { getSpacing, Spacer, Typo } from 'ui/theme'

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
        <StyledMultiSlider
          values={values}
          allowOverlap={true}
          min={props.min || DEFAULT_MIN}
          max={props.max || DEFAULT_MAX}
          step={props.step || DEFAULT_STEP}
          onValuesChange={setValues}
          onValuesChangeFinish={props.onValuesChangeFinish}
          sliderLength={appContentWidth - getSpacing(2 * 2 * 6)}
        />
      </View>
    </React.Fragment>
  )
}

const StyledMultiSlider = styled(MultiSlider).attrs(({ theme }) => {
  const markerStyle = {
    height: getSpacing(7),
    width: getSpacing(7),
    borderRadius: getSpacing(7),
    borderColor: theme.colors.white,
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.black,
    shadowRadius: getSpacing(1),
    shadowOpacity: 0.2,
    elevation: 4,
  }
  return {
    markerStyle,
    pressedMarkerStyle: markerStyle,
    trackStyle: { height: 15, marginTop: -7, borderRadius: theme.borderRadius.button },
    selectedStyle: { backgroundColor: theme.colors.primary },
    unselectedStyle: { backgroundColor: theme.colors.greyMedium },
    containerStyle: { height: getSpacing(8) },
  }
})``
