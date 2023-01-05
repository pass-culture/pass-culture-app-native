import MultiSlider from '@ptomasroos/react-native-multi-slider'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Platform, View } from 'react-native'
import styled from 'styled-components/native'

import { getSpacing, Spacer, Typo } from 'ui/theme'

interface Props {
  values?: number[]
  formatValues?: (label: number) => string
  showValues?: boolean
  min?: number
  max?: number
  step?: number
  onValuesChange?: (newValues: number[]) => void
  onValuesChangeFinish?: (newValues: number[]) => void
  sliderLength?: number
  minLabel?: string
  maxLabel?: string
  shouldShowMinMaxValues?: boolean
  minMaxValuesComplement?: string
  accessibilityLabelledBy?: string
}

const DEFAULT_MIN = 0
const DEFAULT_MAX = 100
const DEFAULT_STEP = 1
const DEFAULT_VALUES = [DEFAULT_MIN, DEFAULT_MAX]

const LEFT_CURSOR = 'LEFT_CURSOR'
const RIGHT_CURSOR = 'RIGHT_CURSOR'

export function Slider(props: Props) {
  const sliderContainerRef = useRef<View | null>(null)

  const min = props.min || DEFAULT_MIN
  const max = props.max || DEFAULT_MAX
  const step = props.step || DEFAULT_STEP
  const minLabel = props.minLabel ?? 'Minimum\u00a0:'
  const maxLabel = props.maxLabel ?? 'Maximum\u00a0:'
  const shouldShowMinMaxValues = props.shouldShowMinMaxValues ?? false
  const minMaxValuesComplement = props.minMaxValuesComplement ?? ''

  const [values, setValues] = useState<number[]>(props.values ?? DEFAULT_VALUES)
  const { formatValues = (s: number) => s } = props

  const getRelativeStepFromKey = (key: string) => {
    if (['ArrowUp', 'ArrowRight'].includes(key)) {
      return step
    }
    return ['ArrowDown', 'ArrowLeft'].includes(key) ? -step : null
  }

  useEffect(() => {
    if (props.onValuesChange) {
      props.onValuesChange(values)
    }
  }, [props, values])

  const updateCursor = (e: Event, cursor: string) => {
    const relativeStep = getRelativeStepFromKey((e as KeyboardEvent).key)
    if (relativeStep === null || ![LEFT_CURSOR, RIGHT_CURSOR].includes(cursor)) return

    let nextValues: number[] = []
    setValues((previousValues) => {
      if (previousValues.length === 1) {
        nextValues = [Math.min(Math.max(min, previousValues[0] + relativeStep), max)]
      } else if (previousValues.length === 2) {
        nextValues =
          cursor === LEFT_CURSOR
            ? [
                Math.min(Math.max(min, previousValues[0] + relativeStep), previousValues[1]),
                previousValues[1],
              ] // Left cursor's value needs to be less than right cursor's value, but greater than min
            : [
                previousValues[0],
                Math.max(Math.min(max, previousValues[1] + relativeStep), previousValues[0]),
              ] // Right cursor's value needs to be greater than left cursor's value, but less than max
      }
      return nextValues
    })

    props.onValuesChangeFinish?.(nextValues)
  }

  const updateLeftCursor = (e: Event) => {
    updateCursor(e, LEFT_CURSOR)
  }

  const updateRightCursor = (e: Event) => {
    updateCursor(e, RIGHT_CURSOR)
  }

  useEffect(() => {
    if (props.values) setValues(props.values)

    let leftCursor: Element, rightCursor: Element
    if (Platform.OS === 'web') {
      if (sliderContainerRef.current) {
        const htmlRef = sliderContainerRef.current as unknown as HTMLDivElement
        ;[leftCursor, rightCursor] = htmlRef.querySelectorAll('[data-testid="slider-control"]')
        leftCursor?.addEventListener('keydown', updateLeftCursor)
        rightCursor?.addEventListener('keydown', updateRightCursor)

        leftCursor?.setAttribute('role', 'slider')
        leftCursor?.setAttribute('aria-valuemin', `${min}`)
        leftCursor?.setAttribute('aria-valuemax', `${values.length === 1 ? max : values[1]}`)
        leftCursor?.setAttribute('aria-valuenow', `${values[0]}`)
        const leftCursorValue = `${rightCursor ? minLabel : maxLabel} ${formatValues(values[0])}`
        props.accessibilityLabelledBy &&
          leftCursor?.setAttribute('aria-labelledby', props.accessibilityLabelledBy)
        leftCursor?.setAttribute('aria-valuetext', leftCursorValue)
        leftCursor?.setAttribute('title', leftCursorValue)

        rightCursor?.setAttribute('role', 'slider')
        rightCursor?.setAttribute('aria-valuemin', `${values[0]}`)
        rightCursor?.setAttribute('aria-valuemax', `${max}`)
        rightCursor?.setAttribute('aria-valuenow', `${values[1]}`)
        const rightCursorValue = `${maxLabel} ${formatValues(values[1])}`
        props.accessibilityLabelledBy &&
          rightCursor?.setAttribute('aria-labelledby', props.accessibilityLabelledBy)
        rightCursor?.setAttribute('aria-valuetext', rightCursorValue)
        rightCursor?.setAttribute('title', rightCursorValue)
      }
    }

    return () => {
      if (Platform.OS === 'web') {
        leftCursor?.removeEventListener('keydown', updateLeftCursor)
        rightCursor?.removeEventListener('keydown', updateRightCursor)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.values])

  const setStyledViewRef = useCallback((ref: View | null) => {
    sliderContainerRef.current = ref
  }, [])

  return (
    <React.Fragment>
      {!!props.showValues && (
        <CenteredText width={props.sliderLength}>
          {values.length === 1 && formatValues(values[0])}
          {values.length === 2 && `${formatValues(values[0])} - ${formatValues(values[1])}`}
        </CenteredText>
      )}
      <Spacer.Column numberOfSpaces={4} />
      <SliderWrapper
        ref={setStyledViewRef}
        testID="slider"
        shouldShowMinMaxValues={shouldShowMinMaxValues}>
        <StyledMultiSlider
          values={values}
          allowOverlap
          min={min}
          max={max}
          step={step}
          onValuesChange={setValues}
          onValuesChangeFinish={props.onValuesChangeFinish}
          sliderLength={props.sliderLength}
        />
      </SliderWrapper>
      {!!shouldShowMinMaxValues && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={1} />
          <MinMaxContainer>
            <MinMaxValue>{`${min}${minMaxValuesComplement}`}</MinMaxValue>
            <MinMaxValue>{`${max}${minMaxValuesComplement}`}</MinMaxValue>
          </MinMaxContainer>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

const StyledMultiSlider = styled(MultiSlider).attrs(({ sliderLength, theme }) => {
  const markerStyle = {
    height: theme.slider.markerSize,
    width: theme.slider.markerSize,
    borderRadius: getSpacing(7),
    borderColor: theme.colors.black,
    borderWidth: getSpacing(0.5),
    backgroundColor: theme.colors.white,
    shadowOpacity: 0,
  }
  const trackStyle = {
    height: theme.slider.trackHeight,
    marginTop: -theme.slider.trackHeight / 2,
    borderRadius: theme.borderRadius.button,
  }
  return {
    markerStyle,
    pressedMarkerStyle: markerStyle,
    trackStyle,
    selectedStyle: { backgroundColor: theme.colors.primary },
    unselectedStyle: {
      backgroundColor: theme.colors.white,
      borderColor: theme.colors.greySemiDark,
      borderWidth: getSpacing(0.5),
    },
    containerStyle: { height: getSpacing(8) },
    sliderLength: sliderLength ?? theme.appContentWidth - getSpacing(2 * 2 * 6),
  }
})``

const CenteredText = styled(Typo.ButtonText)<{ width?: number }>(({ width, theme }) => ({
  width: width ?? theme.appContentWidth - getSpacing(2 * 2 * 6),
  textAlign: 'center',
}))

const MinMaxContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
})

const MinMaxValue = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const SliderWrapper = styled.View<{ shouldShowMinMaxValues?: boolean }>(
  ({ shouldShowMinMaxValues, theme }) => ({
    ...(shouldShowMinMaxValues && { paddingLeft: theme.slider.markerSize / 2 }),
  })
)
